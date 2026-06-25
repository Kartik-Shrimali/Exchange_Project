"use client";
import type { balanceType } from "@/backend/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBalance } from "../utils/httpClient";
import { wsClient } from "../utils/wsClient";

export default function SwapUI({ market }: { market: string }) {
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [activeTab, setActiveTab] = useState('buy');
    const [type, setType] = useState('limit');
    const [balance, setBalance] = useState<balanceType | null>(null)
    const router = useRouter();

    const baseAsset = market.split("_")[0];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/login')
            return;
        }
        const userId = JSON.parse(atob(token.split(".")[1])).userId
        async function init(token: string) {
            const response = await getBalance(token);
            setBalance(response)
            wsClient.subscribe(`balance@${userId}`);
            wsClient.registerCallback(`balance@${userId}`, (newBalance: balanceType) => {
                setBalance(newBalance)
            })
        }
        init(token);
        return () => {
            wsClient.unsubscribe(`balance@${userId}`)
        }
    }, [])

    async function placeOrder() {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/login')
            return;
        }
        const response = await axios.post("http://localhost:3001/api/v1/order", {
            market: market,
            price: Number(price),
            quantity: Number(quantity),
            side: activeTab,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log(`Order placed: `, response.data)
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row h-[60px]">
                <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
                <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex flex-col gap-1">
                <div className="px-3 pt-2">
                    <div className="flex flex-row gap-5">
                        <LimitButton type={type} setType={setType} />
                        <MarketButton type={type} setType={setType} />
                    </div>
                </div>
                <div className="flex flex-col px-3 pt-3 gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-baseTextMedEmphasis">Available Balance</p>
                        <p className="text-xs font-medium text-baseTextHighEmphasis">
                            {activeTab === "buy" ? balance?.INR?.available ?? 0 : balance?.[baseAsset]?.available ?? 0}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-baseTextMedEmphasis">Price</p>
                        <div className="relative">
                            <input
                                step="0.01"
                                placeholder="0"
                                className="h-12 w-full rounded-lg border border-slate-700 bg-[#0e0f14] pr-12 text-right text-xl text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 transition"
                                type="text"
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <img src="/usdc.webp" className="w-6 h-6 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-baseTextMedEmphasis">Quantity</p>
                        <div className="relative">
                            <input
                                step="0.01"
                                placeholder="0"
                                className="h-12 w-full rounded-lg border border-slate-700 bg-[#0e0f14] pr-12 text-right text-xl text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 transition"
                                type="text"
                                onChange={(e) => setQuantity(e.target.value)}
                                value={quantity}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <img src="/sol.webp" className="w-6 h-6 rounded-full" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <p className="text-xs text-baseTextMedEmphasis">
                                {((parseFloat(price) || 0) * (parseFloat(quantity) || 0)).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 mt-1">
                        {["25%", "50%", "75%", "Max"].map((label) => (
                            <div key={label} className="flex items-center justify-center rounded-full px-3 py-1 text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3 text-baseTextMedEmphasis">
                                {label}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className={`h-12 rounded-xl text-base font-semibold transition active:scale-95 ${activeTab === 'buy' ? 'bg-greenPrimaryButtonBackground text-greenPrimaryButtonText hover:opacity-90' : 'bg-red-500 text-white hover:opacity-90'}`}
                        onClick={placeOrder}
                    >
                        {activeTab === 'buy' ? 'BUY' : 'SELL'}
                    </button>

                    <div className="flex flex-row gap-4 mt-1 mb-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="postOnly" className="w-4 h-4 rounded border border-slate-600 bg-[#0e0f14] cursor-pointer accent-green-500" />
                            <label htmlFor="postOnly" className="text-xs text-baseTextMedEmphasis cursor-pointer">Post Only</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="ioc" className="w-4 h-4 rounded border border-slate-600 bg-[#0e0f14] cursor-pointer accent-green-500" />
                            <label htmlFor="ioc" className="text-xs text-baseTextMedEmphasis cursor-pointer">IOC</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LimitButton({ type, setType }: { type: string, setType: any }) {
    return (
        <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('limit')}>
            <div className={`text-sm font-medium py-1 border-b-2 ${type === 'limit' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:text-baseTextHighEmphasis"}`}>
                Limit
            </div>
        </div>
    )
}

function MarketButton({ type, setType }: { type: string, setType: any }) {
    return (
        <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('market')}>
            <div className={`text-sm font-medium py-1 border-b-2 ${type === 'market' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:text-baseTextHighEmphasis"}`}>
                Market
            </div>
        </div>
    )
}

function BuyButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return (
        <div className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === 'buy' ? 'border-b-greenBorder bg-greenBackgroundTransparent' : 'border-b-slate-700 hover:border-b-slate-500'}`} onClick={() => setActiveTab('buy')}>
            <p className="text-center text-sm font-semibold text-greenText">Buy</p>
        </div>
    )
}

function SellButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return (
        <div className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === 'sell' ? 'border-b-redBorder bg-redBackgroundTransparent' : 'border-b-slate-700 hover:border-b-slate-500'}`} onClick={() => setActiveTab('sell')}>
            <p className="text-center text-sm font-semibold text-redText">Sell</p>
        </div>
    )
}