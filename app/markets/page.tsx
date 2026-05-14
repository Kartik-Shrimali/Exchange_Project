"use client"

import { useEffect, useState } from "react"
import { getTickers } from "../utils/httpClient"
import { useRouter } from "next/navigation";
import type { Ticker } from "../utils/types";

export default function Markets() {
    const router = useRouter();
    const [tickers, setTickers] = useState<Ticker[]>([]);

    useEffect(() => {
        async function init() {
            const data = await getTickers();
            setTickers(data);
        }
        init();
    }, [])

    return (
        <div className="flex flex-col flex-1 p-10">
            <h1 className="text-white text-2xl font-bold mb-6">Markets</h1>
            <table className="w-full text-white text-sm">
                <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                        <th className="text-left py-3">Market</th>
                        <th className="text-right py-3">Price</th>
                        <th className="text-right py-3">24H Change</th>
                        <th className="text-right py-3">24H Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {tickers.map((ticker, index) => (
                        <tr key={index} className="border-b border-slate-800 cursor-pointer hover:bg-slate-800" onClick={() => router.push(`/trade/${ticker.symbol}`)}>
                            <td className="py-3">{ticker.symbol.replace("_", " / ")}</td>
                            <td className="text-right py-3">${ticker.lastPrice}</td>
                            <td className={`text-right py-3 ${Number(ticker.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>
                                {Number(ticker.priceChange) > 0 ? "+" : ""}{ticker.priceChangePercent}%
                            </td>
                            <td className="text-right py-3">{ticker.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}