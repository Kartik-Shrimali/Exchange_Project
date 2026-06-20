import express from "express"
import { authMiddleware } from "../middleware";
import { RedisManager } from "../RedisManager";
import { GET_BALANCE } from "../../types/fromApi";

const balanceRouter = express.Router();

balanceRouter.use(authMiddleware);

balanceRouter.get('/', async (req, res) => {
    const userId = req.userId
    if (!userId) {
        res.status(401).json({ msg: "Unauthorized" });
        return;
    }

    const response = await RedisManager.getInstance().sendAndAwait({    
        type: GET_BALANCE,
        data: {
            userId,
        }
    })

    res.status(200).json(response)
})

export {balanceRouter}