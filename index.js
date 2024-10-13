import express from "express";
import scrapeForexData from "./scraper.js";
import dotenv from "dotenv";
import db from "./db.js";
import forexRouter from "./routes/forexRoute.js";

const app = express();

app.use(express.json());
dotenv.config();

app.use("/api", forexRouter);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
