import express from "express"

const klineRouter = express.Router();

klineRouter.get("/" , (req , res) =>{
    res.status(200).json([]);
})

export {klineRouter}