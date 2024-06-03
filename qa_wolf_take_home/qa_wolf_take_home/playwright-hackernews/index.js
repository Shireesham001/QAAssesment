// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { Parser } from 'json2csv';

(async () => {
  try {
    // Launch browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to Hacker News
    await page.goto('https://news.ycombinator.com/');

    // Wait for the necessary elements to load
    await page.waitForSelector('.athing');

    // Extract the top 10 article titles and URLs
    const articles = await page.$$eval('.athing', nodes => {
      return nodes.slice(0, 10).map(node => {
        const titleNode = node.querySelector('.titleline > a');
        if (titleNode) {
          const title = titleNode.innerText;
          const url = titleNode.href;
          return { title, url };
        }
        return null;
      }).filter(article => article !== null);
    });

    // Log the articles array to check if data is being extracted
    console.log('Extracted articles:', articles);

    // Close browser
    await browser.close();

    if (articles.length === 0) {
      throw new Error('No articles were found.');
    }

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields: ['title', 'url'] });
    const csv = json2csvParser.parse(articles);

    // Define the file path
    const filePath = path.join(process.cwd(), 'top_10_articles.csv');

    // Save to CSV file
    fs.writeFileSync(filePath, csv);

    console.log(`Top 10 articles have been saved to ${filePath}`);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
