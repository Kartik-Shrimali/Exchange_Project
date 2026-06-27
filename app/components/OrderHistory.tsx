"use client"

import { useEffect, useState } from "react"
import { getOrderHistory } from "../utils/httpClient"
import type { Trade } from "../utils/types"
import { useRouter } from "next/navigation"

export default function OrderHistory({ market }: { market: string }) {
    const [trades, setTrades] = useState<Trade[]>([])
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push('/login')
            return
        }
        async function init() {
            const data = await getOrderHistory(market, token!)
            setTrades(data)
        }
        init()
    }, [market])

    return (
        <div className="flex flex-col px-4 py-3">
            <h2 className="text-sm font-semibold text-white mb-3">Order History</h2>
            <table className="w-full text-xs text-white">
                <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                        <th className="text-left py-2">Side</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade, i) => (
                        <tr key={i} className="border-b border-slate-800 hover:bg-slate-800">
                            <td className={`py-2 ${trade.isBuyerMaker ? "text-green-400" : "text-red-400"}`}>
                                {trade.isBuyerMaker ? "BUY" : "SELL"}
                            </td>
                            <td className="text-right py-2">{Number(trade.price).toFixed(1)}</td>
                            <td className="text-right py-2">{trade.quantity}</td>
                            <td className="text-right py-2 text-slate-400">{new Date(trade.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                    {trades.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-4 text-slate-400">No trades yet</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}