export default function BidTable({ bids }: { bids: [string, string][] }) {
    let currentTotal: number = 0;
    const releventBids = bids.slice(0, 15);
    let bidsWithTotal: [string, string, number][] = [];

    for (const [price, quantity] of releventBids) {
        currentTotal = currentTotal + parseFloat(quantity);
        bidsWithTotal.push([price, quantity, currentTotal])
    }

    const maxTotal = releventBids.reduce((acc, [price, quantity]) => acc += Number(quantity), 0);

    return (
        <div className="flex flex-col">
            {bidsWithTotal.map(([price, quantity, total], index) => (
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
                                background: "rgba(1, 167, 129, 0.15)",
                                transition: "width 0.3s ease-in-out",
                            }}
                        ></div>
                        <div className="flex justify-between text-xs w-full px-2 py-[2px]">
                            <span className="text-green-400 font-medium">{Number(price).toFixed(1)}</span>
                            <span className="text-slate-300">{quantity}</span>
                            <span className="text-slate-400">{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}