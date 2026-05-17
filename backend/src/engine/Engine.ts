import type { balanceType, orderType } from "../types";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP, type MessagefromApi } from "../types/fromApi";
import { Orderbook } from "./Orderbook"

export const BASE_CURRENCY = "INR";

export class Engine {
    private orderbooks: Orderbook[];
    private userBalances: Map<string, balanceType>;

    constructor() {
        this.orderbooks = [];
        this.userBalances = new Map();
    }

    process(message: MessagefromApi) {
        switch (message.type) {

            case CREATE_ORDER:
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
                    }else{
                        quoteBalance.available += fill.quantity * fill.price
                        userBalance[baseAsset] -= fill.quantity
                    }
                })

                break;
            case CANCEL_ORDER:
                break;

            case ON_RAMP:
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
                break;
            case GET_DEPTH:
                break;
            case GET_OPEN_ORDERS:
                break;
        }
    }
}