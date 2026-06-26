import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/chartManager";
import type { KLine } from "../utils/types";
import { getKlines } from "../utils/httpClient";

export default function TradeView({ market }: { market: string }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInterval , setSelectedInterval] = useState("1m");

    const init = async () => {
        let KLineData: KLine[] = [];
        try {
            KLineData = await getKlines(market, selectedInterval , Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor((new Date().getTime()) / 1000));
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
    }, [market, chartRef , selectedInterval])

    return (
    <div className="flex flex-col">
        <div className="flex flex-row gap-2 px-3 py-2 border-b border-slate-800">
            {["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"].map((interval) => (
                <button
                    key={interval}
                    onClick={() => setSelectedInterval(interval)}
                    className={`text-xs px-3 py-1 rounded transition ${
                        selectedInterval === interval
                            ? "bg-slate-700 text-white"
                            : "text-slate-400 hover:text-white"
                    }`}
                >
                    {interval}
                </button>
            ))}
        </div>
        <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    </div>
)
}