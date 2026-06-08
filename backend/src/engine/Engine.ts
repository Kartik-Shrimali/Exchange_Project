import type { balanceType, orderType } from "../types";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP, type MessagefromApi } from "../types/fromApi";
import { Orderbook } from "./Orderbook"
import { RedisManager } from "./RedisManager";

export const BASE_CURRENCY = "INR";

export class Engine {
    private orderbooks: Orderbook[];
    private userBalances: Map<string, balanceType>;

    constructor() {
        this.orderbooks = [new Orderbook([], [], "TATA", "INR", 0, 0)];
        this.userBalances = new Map();

        //testing pusposes only
        this.userBalances.set("user1", {
            "INR": { available: 100000, locked: 0 },
            "TATA": { available: 100000, locked: 0 }
        });
    }

    process(message: MessagefromApi, clientId: string) {
        switch (message.type) {

            case CREATE_ORDER: {
                const orderbook = this.orderbooks.find(o => o.ticker() === message.data.market)
                if (!orderbook) throw new Error("Orderbook not found for market : " + message.data.market);

                const [baseAsset, quoteAsset] = message.data.market.split("_");

                const userBalance = this.userBalances.get(message.data.userId);
                if (!userBalance) throw new Error("User not found");

                const quoteBalance = userBalance[quoteAsset];
                if (!quoteBalance) throw new Error("Asset not found")

                if (message.data.side == "buy") {
                    if (!(quoteBalance.available >= message.data.quantity * message.data.price)) throw new Error("Insufficient balance ")

                    quoteBalance.available -= message.data.price * message.data.quantity
                    quoteBalance.locked += message.data.price * message.data.quantity

                } else {
                    if (!(userBalance[baseAsset].available >= message.data.quantity)) throw new Error("Insufficient balance")

                    userBalance[baseAsset].available -= message.data.quantity
                    userBalance[baseAsset].locked += message.data.quantity
                }

                const order: orderType = {
                    orderId: Math.random().toString(36).substring(2, 15),
                    userId: message.data.userId,
                    price: message.data.price,
                    market: message.data.market,
                    quantity: message.data.quantity,
                    side: message.data.side,
                    timestamp: Date.now(),
                    filled: 0,
                    remaining: message.data.quantity,
                    status: "pending"
                }

                const { executedQty, fills } = orderbook.addOrder(order);

                fills.forEach(fill => {
                    if (message.data.side === "buy") {
                        quoteBalance.locked -= fill.price * fill.quantity
                        userBalance[baseAsset].available += fill.quantity

                        const otherUserBalance = this.userBalances.get(fill.otherUserId);
                        if (!otherUserBalance) throw new Error("Other user not found");

                        otherUserBalance[baseAsset].locked -= fill.quantity
                        otherUserBalance[quoteAsset].available += fill.quantity * fill.price
                    } else {
                        quoteBalance.available += fill.quantity * fill.price
                        userBalance[baseAsset].locked -= fill.quantity

                        const otherUserBalance = this.userBalances.get(fill.otherUserId);
                        if (!otherUserBalance) throw new Error("Other User not found");

                        otherUserBalance[baseAsset].available += fill.quantity
                        otherUserBalance[quoteAsset].locked -= fill.quantity * fill.price
                    }
                })

                RedisManager.getInstance().publishChannel(clientId, JSON.stringify({
                    executedQty,
                    fills
                }))

                this.publishDepthUpdates(message.data.market);

                fills.forEach(fill => {
                    console.log("Pushing trade to db_processor:", fill.fillId);
                    RedisManager.getInstance().pushToQueue(JSON.stringify({
                        id: fill.fillId,
                        market: message.data.market,
                        price: fill.price,
                        quantity: fill.quantity,
                        timestamp: new Date(fill.timestamp),
                        buyer_id: message.data.side === "buy" ? message.data.userId : fill.otherUserId,
                        seller_id: message.data.side === "sell" ? message.data.userId : fill.otherUserId
                    }))
                })

                break;
            }
            case CANCEL_ORDER: {
                const orderbook = this.orderbooks.find(o => o.ticker() === message.data.market)
                if (!orderbook) throw new Error("Could not find the order of market: " + message.data.market);

                const [baseAsset, quoteAsset] = message.data.market.split("_");

                const userBalance = this.userBalances.get(message.data.userId);
                if (!userBalance) throw new Error("Could not find the user");

                const quoteBalance = userBalance[quoteAsset];
                const baseBalance = userBalance[baseAsset];

                const order = orderbook.cancelOrder(message.data.orderId);

                if (order.bid) {
                    quoteBalance.available += order.bid.price * order.bid.remaining
                    quoteBalance.locked -= order.bid.price * order.bid.remaining
                } else if (order.ask) {
                    baseBalance.available += order.ask.remaining
                    baseBalance.locked -= order.ask.remaining
                }

                RedisManager.getInstance().publishChannel(clientId, JSON.stringify({
                    success: true
                }))

                this.publishDepthUpdates(message.data.market);
                break;
            }
            case ON_RAMP: {
                const balance = this.userBalances.get(message.data.userId);
                if (balance) {
                    balance[BASE_CURRENCY].available += message.data.amount
                } else {
                    this.userBalances.set(message.data.userId, {
                        [BASE_CURRENCY]: {
                            available: message.data.amount,
                            locked: 0
                        }
                    })
                }
                RedisManager.getInstance().publishChannel(clientId, JSON.stringify({ success: true }))
                break;
            }

            case GET_DEPTH: {
                const orderbook = this.orderbooks.find(o => o.ticker() === message.data.market)
                if (!orderbook) throw new Error("Orderbook not found for market" + message.data.market);
                const depth = orderbook.getDepth();
                RedisManager.getInstance().publishChannel(clientId, JSON.stringify(depth));
                break;
            }

            case GET_OPEN_ORDERS: {
                const orderbook = this.orderbooks.find(o => o.ticker() === message.data.market)
                if (!orderbook) throw new Error("Orderbook not found for market" + message.data.market);
                const data = message.data as { userId: string, market: string }
                const openOrder = orderbook.getOpenOrders(data.userId);
                RedisManager.getInstance().publishChannel(clientId, JSON.stringify(openOrder));
                break;
            }
        }
    }

    private publishDepthUpdates(market: string) {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook) throw new Error("Orderbook not found for market: " + market);

        const depth = orderbook.getDepth();
        RedisManager.getInstance().publishChannel(`depth@${market}`, JSON.stringify({
            stream: `depth@${market}`,
            data: depth
        }));
    }
}