export interface orderType{
    orderId : string
    userId : string
    market : string
    price : number
    quantity : number
    side : "buy" | "sell"
    timestamp : number
    filled : number
    remaining : number
    status : "pending" | "partially_filled" | "filled" | "cancelled"
}