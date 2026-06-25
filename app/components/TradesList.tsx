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
                    setTrades(prev => [trade, ...prev].slice(0, 50));
                })
            } catch (e) {
                console.log("error in tradesList.tsx.Error : ", e);
            }
        }
        init();
        return () => {
            wsClient.unsubscribe(`trade@${market}`);
        }
    }, [market])

    return (
        <div className="flex flex-col">
            <div className="flex justify-between text-xs text-slate-400 px-2 py-1 border-t border-slate-800">
                <span>PRICE</span>
                <span>AMOUNT</span>
                <span>TIME</span>
            </div>
            <div className="overflow-y-auto max-h-[200px]">
                {trades.map((trade, i) => (
                    <div className="flex justify-between text-xs px-2 py-[2px] hover:bg-slate-800" key={i}>
                        <span className={`${trade.isBuyerMaker ? "text-green-400" : "text-red-400"}`}>
                            {Number(trade.price).toFixed(1)}
                        </span>
                        <span className="text-slate-300">{trade.quantity}</span>
                        <span className="text-slate-400">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}