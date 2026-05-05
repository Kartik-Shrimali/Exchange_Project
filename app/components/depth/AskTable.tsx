export default function AskTable({asks}: {asks: [string , string][]}){
    return <div>
        AskTable
        {asks.map(([price, quantity] , index) => (
            <p key = {index}>
                Price: {price} || Quantity : {quantity}
            </p>    
        ))}
    </div>
}