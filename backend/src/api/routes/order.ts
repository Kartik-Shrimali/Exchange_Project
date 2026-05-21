import express from "express"
import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../../types/fromApi";

const orderRouter = express.Router();

orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;

    const redisInstance = RedisManager.getInstance()

    const response = await redisInstance.sendAndAwait({
        type: CREATE_ORDER,
        data: { market, price, quantity, side, userId }
    })
    console.log("Order response post /:", response)
    res.status(200).json(response)
})

orderRouter.delete("/", async (req, res) => {
    const { orderId, market, userId } = req.body;

    const redisInstance = RedisManager.getInstance();

    const response = await redisInstance.sendAndAwait({
        type: CANCEL_ORDER,
        data: { orderId, market, userId }
    })
    console.log("Order response delete /:", response)

    res.status(200).json(response);
})
orderRouter.get("/open", async (req, res) => {
    const userId = req.query.userId as string;
    const market = req.query.market as string;

    const redisInstance = RedisManager.getInstance();

    const response = await redisInstance.sendAndAwait({
        type: GET_OPEN_ORDERS,
        data: { userId, market }
    })
    console.log("Order response get /:", response)

    res.status(200).json(response)
})

export { orderRouter }