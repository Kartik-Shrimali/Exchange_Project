export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"
export const GET_DEPTH = "GET_DEPTH"
export const ON_RAMP = "ON_RAMP"
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS" 

export type MessagefromApi = {
    type : typeof CREATE_ORDER
    data : {
        market : string,
        price : number,
        userId : string,
        side : "buy" | "sell",
        quantity : number
    }
} | {
    type : typeof CANCEL_ORDER
    data : {
        orderId : string
        userId : string
        market : string
    }
} | {
    type : typeof ON_RAMP
    data : {
        amount : number
        userId : string
        txnId : string
    }
} | {
    type : typeof GET_DEPTH
    data : {
        market : string
    }
} | {
    type : typeof GET_OPEN_ORDERS
    data : {
        userId : string
        market : string
    }
}