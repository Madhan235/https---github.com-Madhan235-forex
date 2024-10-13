import express from "express";
import { getAverage } from "../controllers/forexController.js";
// https://www.xe.com/currencyconverter/convert/?Amount=1&From=JPY&To=INR
const router = express.Router();

router.get("/", getAverage);

export default router;
