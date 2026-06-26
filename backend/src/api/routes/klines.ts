import express from "express"
import { client } from "../db";

const klineRouter = express.Router();

klineRouter.get("/" , async (req , res) =>{
    const {market , interval , startTime , endTime} = req.query;

    console.log("Query params:", { market, startTime, endTime });
    console.log("Converted dates:", {
        start: new Date(Number(startTime) * 1000),
        end: new Date(Number(endTime) * 1000)
    });

    let tablename;
    switch(interval){
    case '1m':  tablename = 'klines_1m';  break;
    case '5m':  tablename = 'klines_5m';  break;
    case '15m': tablename = 'klines_15m'; break;
    case '30m': tablename = 'klines_30m'; break;
    case '1h':  tablename = 'klines_1h';  break;
    case '4h':  tablename = 'klines_4h';  break;
    case '1d':  tablename = 'klines_1d';  break;
    case '1w':  tablename = 'klines_1w';  break;
    default:    tablename = 'klines_1m';
}

    const response = await client.query(`
        SELECT * FROM ${tablename}
        WHERE market = $1
        AND bucket >= $2
        AND bucket <= $3
        ORDER BY bucket ASC`,[market , new Date(Number(startTime) * 1000) , new Date(Number(endTime) * 1000)])
    res.status(200).json(response.rows.map((row : any) => ({
        open : row.open,
        close : row.close,
        high : row.high,
        low : row.low,
        volume : row.volume,
        start : row.bucket,
        end : new Date(new Date(row.bucket).getTime() + 60 * 1000),
        trades : "0",
        quoteVolume : "0"
    })));
})

export {klineRouter}