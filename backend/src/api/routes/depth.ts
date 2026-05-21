import express from "express"
import { RedisManager } from "../RedisManager";
import { GET_DEPTH } from "../../types/fromApi";

const depthRouter = express.Router();

depthRouter.get("/" , async (req , res) =>{
    const symbol = req.query.symbol as string;
    const redisInstance = RedisManager.getInstance();

    const response = await redisInstance.sendAndAwait({
        type : GET_DEPTH,
        data : {market : symbol}
    })
    console.log("Depth response get /:" , response)

    res.status(200).json(response)
})

export {depthRouter}