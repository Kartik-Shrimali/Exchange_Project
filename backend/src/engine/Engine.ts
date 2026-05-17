import type { balanceType } from "../types";
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