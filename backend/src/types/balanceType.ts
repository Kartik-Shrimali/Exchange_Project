export interface balanceType{
    userId : string
    assets : {
        assetName : string,
        available : number,
        locked : number
    }[]
    // trade_balance : number;
    // locked_balance : number;
}