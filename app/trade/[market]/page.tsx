"use client"
import Depth from "@/app/components/depth/Depth";
import MarketBar from "@/app/components/MarketBar";
import OrderHistory from "@/app/components/OrderHistory";
import SwapUI from "@/app/components/SwapUI";
import TradesList from "@/app/components/TradesList";
import TradeView from "@/app/components/TradeView";
import { useParams } from "next/navigation";

export default function Trade() {
    const params = useParams();
    return (
        <div className="flex flex-row flex-1">
            <div className="flex flex-col flex-1">
                <MarketBar market={params.market as string} />
                <div className="flex flex-row h-[620px] border-y border-slate-800">
                    <div className="flex flex-col flex-1">
                        <TradeView market={params.market as string} />
                    </div>
                    <div className="w-[1px] flex-col border-slate-800 border-l"></div>
                    <div className="flex flex-col w-[250px] overflow-hidden h-full">
                        <div className="flex-1 overflow-hidden">
                            <Depth market={params.market as string} />
                        </div>
                        <div className="border-t border-slate-800">
                            <TradesList market={params.market as string} />
                        </div>
                    </div>
                </div>
                <OrderHistory market={params.market as string} />
            </div>
            <div className="w-[1px] flex-col border-slate-800 border-l"></div>
            <div>
                <div className="flex flex-col w-[250px]">
                    <SwapUI market={params.market as string} />
                </div>
            </div>
        </div>
    );
}