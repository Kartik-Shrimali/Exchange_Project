"use client"
import Depth from "@/app/components/depth/Depth";
import MarketBar from "@/app/components/MarketBar";
import SwapUI from "@/app/components/SwapUI";
import TradeView from "@/app/components/TradeView";
import { useParams } from "next/navigation";

export default function Trade() {
    const params = useParams();
    return (
        <div>
            <MarketBar market = {params.market as string}/>
            <TradeView market = {params.market as string}/>
            <SwapUI market = {params.market as string}/>
            <Depth market = {params.market as string}/>
        </div>
    );
}