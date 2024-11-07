// »
/* eslint-disable no-unused-vars */
// import the required library
// const puppeteer = require('puppeteer');

// import puppeteer from 'puppeteer'; 
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs'; 
import path from 'path'; 




// Add in the code here to scrape the card details 

function getRandomDelay(min = 1000, max = 5000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const scrapeCards = async (page) => {

    const data = await page.evaluate(() => {
        
        const companyData = []; 
    const cards = document.querySelectorAll('.box-company-search.overout'); 

    cards.forEach((card) => {

    const title = card.querySelector(".descr-box-company-search"); 

    console.log('this is the title \n' + title); 

    const titleText = title.innerText; 

    console.log('this is the title \n' + titleText); 


    const cardText = card.innerText; 

    console.log('this is the card text \n' + cardText); 
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    const emailMatch = cardText.match(emailPattern);

    console.log('this is the email match \n' + emailMatch); 



    const phonePattern = /(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g;

    let phoneNumberMatch = cardText.match(phonePattern);
    if (phoneNumberMatch) {
        phoneNumberMatch = phoneNumberMatch.map(number => number.replace(/\s+|\n/g, '').trim());
    }


    console.log('this is the phone number \n' + phoneNumberMatch); 

    companyData.push({

        titleText, 
        phoneNumberMatch,
        emailMatch
    }); 

    console.log('this is the company data object \n' + companyData); 


}); 

console.log('this is the company data \n ' + companyData); 

return companyData; 

})

console.log('this is the data returned by the page scraper \n ' + data); 
return data; 
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
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    const yellowPagesLinks = [

        // IT 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=IT&filtersFlags%5B1%5D=on&flt_category=1049&flt_catname=Informatik%C3%AB+-+konsulenc%C3%AB+dhe+software&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Agencies 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=Agency&flt_catname=Informatik%C3%AB+-+konsulenc%C3%AB+dhe+software&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Consulting 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=CONSULTING&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Call Center 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=CALL+&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Finance 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=FINANCE&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Accounting 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=ACCOUNTING&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Legal
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=LEGAL&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Marketing 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=MARKETING&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        //  Sales
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=SALES&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Design 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=DESIGN&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Web 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=WEB&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Development 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=DEVELOPMENT&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150',
        // Developer 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=DEVELOPER&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Graphics 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=GRAPHIC&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Video Production 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=VIDEO&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Data 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=DATA&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // IT Repair 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=IT+REPAIR&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Digital 
        // 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=IT+&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
        // Research 
        'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=RESEARCH&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150', 
    
        ]


    // This caused a lot of trouble but you might need to bring it back in case of a ban 
    // await page.setRequestInterception(true);
    // page.on('request', (request) => {
    //     if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
    //         request.abort();
    //     } else {
    //         request.continue();
    //     }
    // });



    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.setViewport({ width: 1366, height: 768 });
    
 
    // Replace with yellow pages url
    const baseUrl = 'https://www.yellowpagesalbania.com/search?filters%5B0%5D=on&search=RESEARCH&flt_catname=&filters%5B2%5D=on&where=41.3275459%2C19.8186982&location=Tiran%C3%AB&distance=150';
    let currentPage = 1;
    let lastPageReached = false;
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
 
 
    // set the last page based on the number of pages on the target website
    const lastPage = 5;
    let links = [];     
    const allLinks = [];

    const finalData = []; 

    // const cardData = []; 
 
    // This handles the pagination 
    while (!lastPageReached) {
        // append page URL to the page number incrementally.
        let currentUrl = `${baseUrl}&page=${currentPage}`;

        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

        await page.goto(currentUrl, { timeout: 60000 });
 
        // track the current URL
        let URL = page.url();
        console.log(URL);
 
        // call the function to scrape products on the current page
        const searchText = 'ZBULO'; 

        // Await the findRes function
        let found = await findRes(page, searchText);
        console.log('this is the found result \n' + found); 
 
        if (found) {
            
            // Call the scrape Card Function here and Pass the result to the save file code 
            console.log('we found the ELEMENT CALLING SCRAPE CARDS'); 

            const cardData = await scrapeCards(page); 
            finalData.push(...cardData); 
            console.log('this is the final data \n' + finalData); 

            // console.log('this is the card data \n' + cardData); \
            console.log('this is the card data \n' + JSON.stringify(cardData, null, 2));

          
            currentPage++;   
            console.log('this is the new current page counter \n' + currentPage); 
            await new Promise(r => setTimeout(r, 9000)); // 9 seconds

        } else {
            console.log('Could not find any result text');
            lastPageReached = true;
        }
    }


    // Save to the file using the object that has collected all the data 

    console.log('this is the final data before it is saved \n' + finalData); 

    // try{

    //     fs.writeFileSync('savedLinks.json', JSON.stringify(finalData, null, 2), 'utf-8');

    // } catch(error){

    //     console.error('could not save file \n' + error); 
    // }

    // Save the data here 
    const jsonString = JSON.stringify(finalData, null, 2); // The `null, 2` makes it pretty-printed

    const directoryPath  = './Data'; 
    
    // Digital
    const fileName = 'Research.json'; 
    
    
    const filePath = path.join(directoryPath, fileName); // Create the full path
  
  
  
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
      if (err) {
          return console.error('Error writing JSON to file:', err);
      }
      console.log(`JSON data has been saved to ${filePath}`);
  });
  
  
    await browser.close();
})();
