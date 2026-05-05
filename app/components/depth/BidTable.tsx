export default function BidTable({bids} : {bids : [string , string][]}){
    return (
        <div>
            BidTable
            {bids.map(([price , quantity] , index) => (
                <p key = {index}>
                    Price: {price} || Quantity : {quantity}
                </p>    
            ))}
        </div>
    )
}