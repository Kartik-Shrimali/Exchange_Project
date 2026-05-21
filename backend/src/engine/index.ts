import { createClient } from "redis";
import { Engine } from "./Engine";

async function main() {
    const engine = new Engine();
    const redisClient = createClient();
    await redisClient.connect();
    console.log("REDIS CLIENT CONNECTED");

    while (true) {
        const response = await redisClient.rPop("messages")

        if (response) {
            const parsedResponse = JSON.parse(response)
            const message = parsedResponse.message;
            const clientId = parsedResponse.clientId;
            engine.process(message , clientId);
        }
    }
}
main();