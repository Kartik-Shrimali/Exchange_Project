import axios from "axios";
import type { orderType } from "../types";

const BASE_URL = "http://localhost:3001/api/v1"
const TOTAL_BIDS = 15;
const TOTAL_ASKS = 15;
const USER_ID = "mm_bot"
const MM_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtbV9ib3QiLCJpYXQiOjE3ODE4OTMxMjcsImV4cCI6NDkzNzY1MzEyN30.oQvWqe-BAwkJi7P0VgeKajfqoEcYKNh8AbuZtA0DXEs"

const defaultPrices: {
    [key: string]: {
        defaultPrice: number
    }
} = {
    ["BTC_INR"]: {
        defaultPrice: 500000
    },
    ["SOL_INR"]: {
        defaultPrice: 100000
    },
    ["ETH_INR"]: {
        defaultPrice: 300000
    }
}

axios.defaults.headers.common['Authorization'] = `Bearer ${MM_TOKEN}`

async function main(market: string): Promise<any> {
    console.log(`MM bot started for ${market}`);

    while (true) {
        const response = await axios.get(`${BASE_URL}/ticker`)
        console.log(`${market} ticker response:`, response.data);

        let lastPrice = Number(response.data.find((o: any) => o.symbol === market)?.lastPrice);

        if (!lastPrice) {
            lastPrice = defaultPrices[market].defaultPrice
        }

        const openOrders = await axios.get(`${BASE_URL}/order/open?userId=${USER_ID}&market=${market}`);
        const totalBids = openOrders.data.openBids.length;
        const totalAsks = openOrders.data.openAsks.length;


        const combinedArray = [...openOrders.data.openBids, ...openOrders.data.openAsks];

        const cancelledBids = await cancelBidsMoreThan(combinedArray, lastPrice, market);
        const cancelledAsks = await cancelAsksLessThan(combinedArray, lastPrice, market);

        let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
        let asksToAdd = TOTAL_ASKS - totalAsks - cancelledAsks;

        while (bidsToAdd > 0 || asksToAdd > 0) {
            if (bidsToAdd > 0) {
                await axios.post(`${BASE_URL}/order`, {
                    market: market,
                    price: (lastPrice - (Math.random() * 1)).toFixed(1).toString(),
                    quantity: 1,
                    side: "buy",
                    userId: USER_ID
                })
                bidsToAdd--;
            }
            if (asksToAdd > 0) {
                await axios.post(`${BASE_URL}/order`, {
                    market: market,
                    price: (lastPrice + (Math.random() * 1)).toFixed(1).toString(),
                    quantity: 1,
                    side: "sell",
                    userId: USER_ID
                })
                asksToAdd--;
            }
        }

        await sleep(5000);
    }
}

async function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}

async function cancelAsksLessThan(openOrders: orderType[], price: number, market: string) {
    let promises: Promise<any>[] = [];

    openOrders.map(async o => {
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            promises.push(axios.delete(`${BASE_URL}/order`, {
                data: {
                    orderId: o.orderId,
                    market: market,
                    userId: USER_ID
                }
            }))
        }
    })
    await Promise.all(promises);
    return promises.length;
}

async function cancelBidsMoreThan(openOrders: orderType[], price: number, market: string) {
    let promises: Promise<any>[] = [];

    openOrders.map(async o => {
        if (o.side === "buy" && (o.price > price || Math.random() < 0.1)) {
            promises.push(axios.delete(`${BASE_URL}/order`, {
                data: {
                    orderId: o.orderId,
                    market: market,
                    userId: USER_ID

                }
            }))
        }
    })
    await Promise.all(promises);
    return promises.length
}

let marketPromise: Promise<any>[] = []
marketPromise.push(main("BTC_INR"));
marketPromise.push(main("ETH_INR"));
marketPromise.push(main("SOL_INR"));

Promise.all(marketPromise)