import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/chartManager";
import type { KLine } from "../utils/types";
import { getKlines } from "../utils/httpClient";

export default function TradeView({ market }: { market: string }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);

    const init = async () => {
        let KLineData: KLine[] = [];
        try {
            KLineData = await getKlines(market, "1m", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor((new Date().getTime()) / 1000));

            console.log("KLine data:", KLineData);
        } catch (e) {
            console.log("Error: ", e);
        }

        if (chartRef.current) {
            if (chartManagerRef.current) {
                chartManagerRef.current.destroy();
            }
            const chartManager = new ChartManager(chartRef.current,
                [
                    ...KLineData.map((x) => ({
                        close: parseFloat(x.close),
                        open: parseFloat(x.open),
                        high: parseFloat(x.high),
                        low: parseFloat(x.low),
                        timestamp: new Date(x.end),
                    })),
                ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
                {
                    background: "#0e0f14",
                    color: "white",
                }
            );
            chartManagerRef.current = chartManager;
        }
    };

    useEffect(()=>{
        init();
    } , [market , chartRef])

    return (
        <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    )
}