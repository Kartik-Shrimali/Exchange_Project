import type { balanceType } from "../types";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP, type MessagefromApi } from "../types/fromApi";
import { Orderbook } from "./Orderbook"

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
                break;
            case GET_DEPTH:
                break;
            case GET_OPEN_ORDERS:
                break;
        }
    }
}