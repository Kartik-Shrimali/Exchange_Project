import { Client } from "pg"
import { createClient, RedisClientType } from "redis"

const client = new Client({
    host: "localhost",
    port: 5432,
    database: "exchange_db",
    user: 'postgres',
    password: "password"
})

const redisClient : RedisClientType= createClient();
client.connect().then(d => {
    console.log("Database connected");
});
redisClient.connect().then(d => {
    console.log("Redis Client connected")
});

async function main() {
    while (true) {
        const response = await redisClient.rPop("db_processor");
        if (response) {
            const data = JSON.parse(response);
            const query = `INSERT INTO trades (id,market,price,quantity,timestamp,buyer_id,seller_id) VALUES($1,$2,$3,$4,$5,$6,$7)`;

            await client.query(query,[data.id, data.market,data.price,data.quantity,data.timestamp,data.buyer_id,data.seller_id]);

            console.log("Trade saved to db: ",data.id);
        }
    }
}

main();