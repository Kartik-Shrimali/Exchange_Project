import { getTicker } from "@/app/utils/httpClient"
import { useEffect, useState } from "react";
export default function MarketBar({ market }: { market: string }) {
    const [ticker, setTicker] = useState("");

    useEffect(() => {
        async function getValue(){
            const response = await getTicker("SOL_USDC");
            setTicker(response.lastPrice);
        }

        getValue();
    }, [])

    return (
        <div>
            MarketBar
            {ticker}
        </div>
    );
}