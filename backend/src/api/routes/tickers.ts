import express from "express"
import {client} from "../db"

const tickerRouter = express.Router();

tickerRouter.get("/" , async (req , res) =>{
    const response = await client.query(`
        SELECT price FROM trades ORDER BY timestamp DESC LIMIT 1`);

    const lastPrice = response.rows[0]?.price || "0";

    res.status(200).json([{
         symbol: "TATA_INR",
        lastPrice: lastPrice,
        priceChange: "0",
        priceChangePercent: "0",
        volume: "0",
        trades: "0",
        firstPrice: lastPrice,
        high: lastPrice,
        low: lastPrice
    }]);
})

export {tickerRouter}