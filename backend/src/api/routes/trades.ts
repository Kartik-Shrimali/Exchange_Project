import express from "express"
import {client} from "../db";

const tradeRouter = express.Router();

tradeRouter.get("/" , async (req , res) =>{
    const {market} = req.query;
    const response = await client.query(`SELECT * FROM trades WHERE market = $1 ORDER BY timestamp DESC LIMIT 50`,[market]);
    res.status(200).json(response.rows);   
})

export {tradeRouter}