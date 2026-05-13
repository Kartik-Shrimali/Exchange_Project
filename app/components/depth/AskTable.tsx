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

    return <div>
        AskTable
        {asksWithTotal.map(([price, quantity, total], index) => (
            // <p key = {index}>
            //     Price: {price} || Quantity : {quantity} || Total: {total}
            // </p>
            <div key = {index}>
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
                            left: 0,
                            width: `${(100 * total) / maxTotal}%`,
                            height: "100%",
                            background: "rgba(228, 75, 68, 0.325)",
                            transition: "width 0.3s ease-in-out",
                        }}
                    ></div>
                    <div className="flex justify-between text-xs w-full">
                        <div>
                            {price}
                        </div>
                        <div>
                            {quantity}
                        </div>
                        <div>
                            {total?.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
}