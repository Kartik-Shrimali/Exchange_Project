import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/chartManager";
import type { KLine } from "../utils/types";
import { getKlines } from "../utils/httpClient";

export default function TradeView({ market }: { market: string }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);
    const [isLoading, setIsLoading] = useState(true);

    const init = async () => {
        let KLineData: KLine[] = [];
        try {
            KLineData = await getKlines(market, "1m", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor((new Date().getTime()) / 1000));
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
        setIsLoading(false);
    };

    useEffect(() => {
        init();
        const interval = setInterval(init, 1000 * 60);
        return () => clearInterval(interval);
    }, [market, chartRef])

    return (
        <div style={{ height: "520px", width: "100%", marginTop: 4, position: "relative" }}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0e0f14]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-slate-600 border-t-green-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-xs">Loading chart...</p>
                    </div>
                </div>
            )}
            <div ref={chartRef} style={{ height: "100%", width: "100%" }}></div>
        </div>
    )
}