import puppeteer from "puppeteer";
import db from "./db.js";
import cron from "node-cron";

const scrapeForexData = async (from) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=INR`;

  await page.goto(url);

  try {
    const conversionRate = await page.evaluate(() => {
      const inrElement = document.querySelector(
        '[data-testid="conversion"] .sc-423c2a5f-1'
      );
      if (!inrElement) {
        throw new Error("Element not found");
      }
      const inrRateText = inrElement.innerText;
      return parseFloat(inrRateText.match(/[0-9.]+/)[0]);
    });

    return conversionRate;
  } catch (error) {
    console.error("Error extracting conversion rate:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
};

const startScraping = async () => {
  try {
    const usdRate = await scrapeForexData("USD");
    const gbpRate = await scrapeForexData("GBP");
    const euroRate = await scrapeForexData("EUR");

    console.log(
      `USD Rate: ${usdRate}, GBP Rate: ${gbpRate}, Euro Rate: ${euroRate}`
    );

    const currentDate = new Date().toISOString().split("T")[0];

    const insertQuery = `INSERT INTO conversions (usd, gbp, euro, date) VALUES (?, ?, ?, ?)`;

    await db.query(insertQuery, [usdRate, gbpRate, euroRate, currentDate]);
    console.log("Scraping completed and data saved to DB with latest data.");
  } catch (error) {
    console.error("Error during scraping:", error.message);
  }
};

cron.schedule("0 6 * * *", () => {
  startScraping();
});

export default scrapeForexData;
