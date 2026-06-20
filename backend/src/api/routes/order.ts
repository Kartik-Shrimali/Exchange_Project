import express from "express"
import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../../types/fromApi";
import { authMiddleware } from "../middleware";

const orderRouter = express.Router();

orderRouter.use(authMiddleware);

orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side } = req.body;
    const userId = req.userId;

    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }

    const redisInstance = RedisManager.getInstance()

    const response = await redisInstance.sendAndAwait({
        type: CREATE_ORDER,
        data: { market, price, quantity, side, userId }
    })
    console.log("Order response post /:", response)
    res.status(200).json(response)
})

orderRouter.delete("/", async (req, res) => {
    const { orderId, market, } = req.body;
    const userId = req.userId

    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }

    const redisInstance = RedisManager.getInstance();

    const response = await redisInstance.sendAndAwait({
        type: CANCEL_ORDER,
        data: { orderId, market, userId }
    })
    console.log("Order response delete /:", response)

    res.status(200).json(response);
})
orderRouter.get("/open", async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }

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