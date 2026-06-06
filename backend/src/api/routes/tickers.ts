import express from "express"

const tickerRouter = express.Router();

tickerRouter.get("/" , (req , res) =>{
    res.status(200).json([{
        symbol: "TATA_INR",
        lastPrice: "1000",
        priceChange: "0",
        priceChangePercent: "0",
        volume: "0"
    }]);
})

export {tickerRouter}