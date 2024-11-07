/* eslint-disable no-unused-vars */
import puppeteer from 'puppeteer'; 
import fs from 'fs'; 
import path from 'path'; 


const scrapePage = async (page, links) => {

    // Create an empty array to hold scraped data
    const scrapedData = []; 
    const myVar = 'var'; 

    for (const link of links) {

        // Go to the current link
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 80000 });

        // Extract data from the page
        const data = await page.evaluate(() => {
            // Get company title
            const companyTitleElement = document.querySelector('h2');
            const companyTitleText = companyTitleElement && companyTitleElement.querySelector('span')
                ? companyTitleElement.querySelector('span').textContent.trim()
                : 'N/A';
            // Get admin name
            const adminLabel = 'Administrator:';
            const adminElement = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === adminLabel);
            const adminSiblingText = adminElement && adminElement.nextElementSibling ? adminElement.nextElementSibling.textContent.trim() : 'N/A';

            // Get address
            const addressLabel = 'Seli/Zyra Qendrore:';
            const addressElement = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === addressLabel);
            const addressElementText = addressElement && addressElement.nextElementSibling ? addressElement.nextElementSibling.textContent.trim() : 'N/A';

            // Get email
            const emailLabel = 'Adresa Email';
            const emailElement = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === emailLabel);
            const emailElementText = emailElement && emailElement.nextElementSibling ? emailElement.nextElementSibling.textContent.trim() : 'N/A';

            // Get phone number
            const phoneLabel = 'Telefoni';
            const phoneElement = Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === phoneLabel);
            const phoneElementText = phoneElement && phoneElement.nextElementSibling ? phoneElement.nextElementSibling.textContent.trim() : 'N/A';


            console.log('----LOGGING ITEMS OUT----'); 
            console.log('Admin Element:', adminSiblingText);
            console.log('Address Element:', addressElementText);
            console.log('Email Element:', emailElementText);
            console.log('Phone Element:', phoneElementText);


            
            // Return the extracted data
            return {
                companyTitleText, 
                adminSiblingText, 
                addressElementText,
                emailElementText, 
                phoneElementText
            };
        });

        // Push the extracted data into the array
        console.log('___________++++++++_____--------------\n');
        console.log('this is the scraped DATA \n' + data); 


        // Save the data to a file here with a timestamp 


        scrapedData.push(data);
    }

    // Log the scraped data outside the loop
    console.log('Scraped Data:', scrapedData);

    return scrapedData; 

  
};



// Execute the scraping logic
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
 
    // Add in the links Array from the other program 
    // base
    const linkArray = [
        "https://opencorporates.al/sq/nipt/l62226020k",
        "https://opencorporates.al/sq/nipt/l71914008u",
        "https://opencorporates.al/sq/nipt/m31502001e",
        "https://opencorporates.al/sq/nipt/k01719004w"
      ]

    // Await the result of the scrapePage function
   const finalData = await scrapePage(page, linkArray); 

   console.log('THIS IS THE FINAL DATA \n' + finalData); 


   const jsonString = JSON.stringify(finalData, null, 2); // The `null, 2` makes it pretty-printed

   const directoryPath  = './OpenData'; 

   
   
   // Digital
   const fileName = 'Video_Production.json'; 
   
   
   const filePath = path.join(directoryPath, fileName); // Create the full path
 
 
 
   fs.writeFile(filePath, jsonString, 'utf8', (err) => {
     if (err) {
         return console.error('Error writing JSON to file:', err);
     }
     console.log(`JSON data has been saved to ${filePath}`);
 });

    await browser.close();
})();
