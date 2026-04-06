    import { getTicker } from "@/app/utils/httpClient"
    import { useEffect, useState } from "react";
    import type { Ticker } from "../utils/types";
    export default function MarketBar({ market }: { market: string }) {
        const [ticker, setTicker] = useState<Ticker | null>(null);

        useEffect(() => {
            async function getValue(){
                const response = await getTicker(market);
                setTicker(response);
            }

            getValue();
        }, [])

        return (
            <div>
                MarketBar
                {ticker?.firstPrice}
                {ticker?.high}
                {ticker?.lastPrice}
                {ticker?.low}
                {ticker?.priceChange}
                {ticker?.priceChangePercent}
                {ticker?.symbol}
                {ticker?.trades}
                {ticker?.volume}
            </div>
        );
    }