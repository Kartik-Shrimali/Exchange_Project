import express from "express"
import { client } from "../db"

const tickerRouter = express.Router();

tickerRouter.get("/", async (req, res) => {
    const response = await client.query(`
        SELECT DISTINCT ON (market) market, price FROM trades ORDER BY market, timestamp DESC`);

    if (response.rows.length === 0) {
        res.status(200).json([]);
        return;
    }
       res.status(200).json(response.rows.map((row: any) => ({
        symbol: row.market,
        lastPrice: row.price,
        priceChange: "0",
        priceChangePercent: "0",
        volume: "0",
        trades: "0",
        firstPrice: row.price,
        high: row.price,
        low: row.price
    })));
})
export { tickerRouter }