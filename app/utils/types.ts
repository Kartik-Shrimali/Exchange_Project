export interface KLine{
    close:string
    open:string
    start:string
    end: string
    high:string
    low:string
    trades:string
    volume:string
    quoteVolume: string
}

export interface Depth{
    bids: [string, string][];
    asks:[string, string][];
    lastUpdateId: string;
}

export interface Trade{
    id: number
    isBuyerMaker : boolean
    price : string
    quantity : string
    quoteQuantity : string
    timestamp : number

}

export interface Ticker{
    firstPrice : string
    lastPrice : string
    high : string
    low : string
    priceChange : string
    priceChangePercent : string
    volume : string
    trades : string
    symbol : string
}