import express from "express"

const tradeRouter = express.Router();

tradeRouter.get("/" , (req , res) =>{
    res.status(200).json([]);   
})

export {tradeRouter}