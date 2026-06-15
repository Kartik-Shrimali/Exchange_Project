"use client"
import Depth from "@/app/components/depth/Depth";
import MarketBar from "@/app/components/MarketBar";
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
                    <div className="flex flex-col w-[250px] overflow-hidden">
                        <Depth market={params.market as string} />
                        <div>
                            <TradesList market={params.market as string} />
                        </div>
                    </div>
                </div>

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