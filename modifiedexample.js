/* eslint-disable no-unused-vars */
// import the required library
// const puppeteer = require('puppeteer');

import puppeteer from 'puppeteer'; 
import fs from 'fs'; 
// const path = require('path');
import path from 'path'; 

// Add in the page here and see if you can get it working 

// Scrapes the links from all the cards 
async function scrapeProducts(page) {

    const searchLinks = [


    ]; 




    console.log('scraping'); 

    console.log('this is the scrape products function running \n'); 

    await page.waitForSelector('[class^="card"]');
    
    // Add in the logic to Grab all the Cards here 
    const cardList = await page.evaluate(() => {
        
        const linksArray = []; 

        // Create the query to find all card elements with a Card class 
        let cards = document.querySelectorAll('[class^="card"'); 

        console.log('these are the cards \n' + cards); 


        // Now loop through the Cards and extract the links 
        cards.forEach(card => {


            console.log('this is the current card \n' + card); 


            if(card.textContent.includes('Më shumë')){

                const link = card.querySelector('a'); 

                console.log('this is the current link \n' + link); 

                if(link && link.href){

                    console.log('this is the current href \n' + link.href); 

                    linksArray.push(link.href); 

                }


            }

        }); 

        console.log('this is the links array \n' + linksArray); 


        return linksArray; 


    })

    console.log('this is the card List \n' + cardList); 

    return cardList; 
}

const findRes = async (page, searchText) => {
    // Look for the text Më shumë
    return await page.evaluate((text) => {
        const element = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === text); 
        return !!element; 
    }, searchText);
}


// execute the scraping logic
(async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
 
    const baseUrl = 'https://opencorporates.al/sq/search?name=digital';
    let currentPage = 1;
    let lastPageReached = false;
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
 
 
    // set the last page based on the number of pages on the target website
    const lastPage = 5;
    let links = []; 
    const allLinks = [];
 
    // This handles the pagination 
    while (!lastPageReached) {
        // append page URL to the page number incrementally.
        let currentUrl = `${baseUrl}&page=${currentPage}`;
 
        await page.goto(currentUrl, { timeout: 60000 });
 
        // track the current URL
        let URL = page.url();
        console.log(URL);
 
        // call the function to scrape products on the current page
        const searchText = 'Më shumë'; 

        // Await the findRes function
        let found = await findRes(page, searchText);
        console.log('this is the found result \n' + found); 
 
        if (found) {
            // Call the scrape function here and then save the data 
            // Scrapes the links from all the Cards 
            links = await scrapeProducts(page);
            allLinks.push(...links);
            console.log('these are all the links \n' + allLinks); 
            console.log('this is the length of the all links array \n' + allLinks.length); 
            
    // Save the data here 
    const jsonString = JSON.stringify(allLinks, null, 2); // The `null, 2` makes it pretty-printed

    const directoryPath  = './OpenData'; 
    
    // Digital
    const fileName = 'Digital.json'; 
    
    
    const filePath = path.join(directoryPath, fileName); // Create the full path
  
  
  
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
          return console.error('Error writing JSON to file:', err);
      }
      console.log(`JSON data has been saved to ${filePath}`);
  });
          

            currentPage++;   
            console.log('this is the new current page counter \n' + currentPage); 
            await new Promise(r => setTimeout(r, 9000)); // 9 seconds

            


        } else {
            // If the text isn't found, mark that we've reached the last page
            console.log('Could not find any result text');
            lastPageReached = true;
        }
    }

    console.log('these are the links that where scraped OUTSIDE THE WHILE LOOP \n' + links); 
    console.log('this is the number of links \n' + links.length); 

  
    await browser.close();
})();
