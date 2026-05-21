import express from "express"

const tickerRouter = express.Router();

tickerRouter.get("/" , (req , res) =>{
    res.status(200).json([]);
})

export {tickerRouter}