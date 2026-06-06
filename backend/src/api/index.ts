import express from "express"
import cors from "cors"
import {orderRouter} from "./routes/order"
import {klineRouter} from "./routes/klines"
import {depthRouter} from "./routes/depth"
import {tickerRouter} from "./routes/tickers"
import {tradeRouter} from "./routes/trades"

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use("/api/v1/order" , orderRouter);
app.use("/api/v1/kline" , klineRouter);
app.use("/api/v1/depth" , depthRouter);
app.use("/api/v1/ticker" , tickerRouter);
app.use("/api/v1/trade" , tradeRouter);

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
})