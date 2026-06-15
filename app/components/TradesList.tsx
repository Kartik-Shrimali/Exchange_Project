"use client"

import { useEffect, useState } from "react"
import { getTrades } from "../utils/httpClient";
import { wsClient } from "../utils/wsClient";
import type { Trade } from "../utils/types";

export default function TradesList({ market }: { market: string }) {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        async function init() {
            try {
                getTrades(market).then(d => {
                    setTrades(d);
                })

                wsClient.subscribe(`trade@${market}`);
                wsClient.registerCallback(`trade@${market}`, (trade: Trade) => {
                    setTrades(prev => [trade, ...prev]);
                })
            } catch (e) {
                console.log("error in tradesList.tsx.Error : ", e);
            }

        }
        init();
        return () => {
            wsClient.unsubscribe(`trade@${market}`);
        }


    }, [])
    return (
        <div>
            <div className="flex text-xs justify-between">
                <div>
                    PRICE
                </div>
                <div>
                    AMOUNT
                </div>
                <div>
                    TIME
                </div>
            </div>
            {trades.map((trade, i) => (
                <div className="text-xs text-white flex justify-between" key={i}>
                    <div>{trade.price} </div>
                    <div> {trade.quantity}</div>
                    <div>{new Date(trade.timestamp).toLocaleTimeString()}</div>
                </div>
            ))}
        </div>
    )
}