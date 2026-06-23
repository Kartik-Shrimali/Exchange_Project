export default function AskTable({ asks }: { asks: [string, string][] }) {
    let currentTotal: number = 0;
    const releventAsks = asks.slice(0, 15);
    releventAsks.reverse();
    let asksWithTotal: [string, string, number][] = [];

    for (const [price, quantity] of releventAsks) {
        currentTotal = currentTotal + parseFloat(quantity);
        asksWithTotal.push([price, quantity, currentTotal])
    }

    const maxTotal = releventAsks.reduce((acc, [price, quantity]) => acc += Number(quantity), 0)

    return (
        <div className="flex flex-col">
            <div className="flex justify-between text-xs text-slate-400 px-2 py-1">
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
            </div>
            {asksWithTotal.map(([price, quantity, total], index) => (
                <div key={index}>
                    <div
                        style={{
                            display: "flex",
                            position: "relative",
                            width: "100%",
                            backgroundColor: "transparent",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: `${(100 * total) / maxTotal}%`,
                                height: "100%",
                                background: "rgba(228, 75, 68, 0.15)",
                                transition: "width 0.3s ease-in-out",
                            }}
                        ></div>
                        <div className="flex justify-between text-xs w-full px-2 py-[2px]">
                            <span className="text-red-400 font-medium">{Number(price).toFixed(1)}</span>
                            <span className="text-slate-300">{quantity}</span>
                            <span className="text-slate-400">{total?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}