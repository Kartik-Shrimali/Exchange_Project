import express from "express"
import {client} from "../db";
import { authMiddleware } from "../middleware";

const tradeRouter = express.Router();

tradeRouter.get("/" , async (req , res) =>{
    const {market} = req.query;
    const response = await client.query(`SELECT * FROM trades WHERE market = $1 ORDER BY timestamp DESC LIMIT 50`,[market]);
    res.status(200).json(response.rows);   
})

tradeRouter.get("/history" , authMiddleware , async(req , res) => {
    const userId = req.userId;
    const market = req.query.market as string;

    const query = `SELECT * FROM trades WHERE market=$1 AND (buyer_id=$2 OR seller_id=$3)`;
    const response = await client.query(query , [market ,userId , userId])

    res.status(200).json(response.rows);
})

export {tradeRouter}