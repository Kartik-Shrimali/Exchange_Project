import type { fillType, orderType } from "../types";

export class Orderbook {
    private bids: orderType[];
    private asks: orderType[];
    private baseAsset: string;
    private quoteAsset: string;
    private lastTradeId: number;
    private currentPrice: number;

    constructor(bids: orderType[], asks: orderType[], baseAsset: string, quoteAsset: string, lastTradeId: number, currentPrice: number) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.currentPrice = currentPrice;
        this.lastTradeId = lastTradeId;
        this.quoteAsset = quoteAsset;
    }

    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`
    }

    addOrder(order: orderType): { executedQty: number, fills: fillType[] } {
        let remainingQty = 0;
        let executedQty: number = 0;
        let fills: fillType[] = [];
        let result = null;
        if (order.side == "buy") {
            this.asks.sort((a, b) => a.price - b.price)
            result = this.matchBid(order);
        } else {
            this.bids.sort((a, b) => b.price - a.price)
            result = this.matchAsk(order);
        }

        executedQty = result.executedQty;
        fills = result.fills;
        remainingQty = order.quantity - executedQty;

        if (remainingQty > 0) {
            order.remaining = remainingQty;
            if (order.side == "buy") {
                this.bids.push(order);
            } else {
                this.asks.push(order);
            }
        }

        return {
            executedQty,
            fills,
        }
    }

    cancelOrder(orderId : string) {
        //checking if order exists in bids or asks
        const bid = this.bids.find(x => x.orderId === orderId)
        const ask = this.asks.find(x => x.orderId === orderId)
        
        //removing from bids/asks using filter
        if(bid){
            this.bids = this.bids.filter(x => x.orderId != bid.orderId)
            return {bid}
        }

        if(ask){
            this.asks = this.asks.filter(x => x.orderId != ask.orderId)
            return {ask}
        }

        throw new Error("Order not found")

    }

    matchBid(buyOrder: orderType): { executedQty: number, fills: fillType[] } {
        let executedQty: number = 0;
        let fills: fillType[] = [];

        for (const ask of this.asks) {
            if (buyOrder.price >= ask.price) {
                const matchQty = Math.min(buyOrder.remaining, ask.remaining);
                const fill: fillType = {
                    fillId: Math.random().toString(36).substring(2, 15),
                    tradeId: this.lastTradeId++,
                    price: ask.price,
                    quantity: matchQty,
                    timestamp: Date.now(),
                    otherUserId : ask.userId
                }

                ask.remaining = ask.remaining - matchQty;

                buyOrder.remaining = buyOrder.remaining - matchQty;

                executedQty += matchQty;

                fills.push(fill);

                if (ask.remaining == 0) {
                    this.asks = this.asks.filter(a => a.remaining > 0);
                }

                if (buyOrder.remaining == 0) {
                    break; //kyuki order already complete ho chuka hai
                }
            }
        }

        return {
            executedQty,
            fills,
        }
    }

    matchAsk(sellOrder: orderType): { executedQty: number, fills: fillType[] } {
        let executedQty: number = 0;
        let fills: fillType[] = [];

        for(const bid of this.bids){
            if(sellOrder.price <= bid.price){
                const matchQty = Math.min(sellOrder.remaining , bid.remaining);

                const fill : fillType = {
                    fillId: Math.random().toString(36).substring(2, 15),
                    tradeId : this.lastTradeId++,
                    price : bid.price,
                    quantity : matchQty,
                    timestamp : Date.now(),
                    otherUserId : bid.userId
                }

                sellOrder.remaining -= matchQty;
                bid.remaining -= matchQty;
                executedQty += matchQty;

                fills.push(fill);

                if(bid.remaining == 0){
                    this.bids = this.bids.filter(a => a.remaining > 0);
                }
                if(sellOrder.remaining == 0){
                    break; //kyuki order complete ho chuka hai 
                }
            }
        }

        return {
            executedQty,
            fills,
        }
    }

    getDepth(): { bids: [string, string][], asks: [string, string][] } {
        const bidsObj: { [key: string]: number } = {}
        const asksObj: { [key: string]: number } = {}

        for (const bid of this.bids) {
            if (!bidsObj[bid.price]) {
                bidsObj[bid.price] = 0;
            }
            bidsObj[bid.price] += bid.quantity;
        }

        for (const ask of this.asks) {
            if (!asksObj[ask.price]) {
                asksObj[ask.price] = 0;
            }
            asksObj[ask.price] += ask.quantity

        }

        const bidArray: [string, string][] = Object.entries(bidsObj).map(([price, quantity]) => [price, quantity.toString()]);

        const askArray: [string, string][] = Object.entries(asksObj).map(([price, quantity]) => [price, quantity.toString()]);

        return {
            bids: bidArray,
            asks: askArray
        }
    }

    getOpenOrders(userId : string) : {openBids : orderType[] , openAsks : orderType[]}{
        const openBids  = this.bids.filter(o => o.userId === userId)
        const openAsks  = this.asks.filter(o => o.userId === userId)

        return {openBids , openAsks}
    }
}