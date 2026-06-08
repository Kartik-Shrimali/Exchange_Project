import {Client} from "pg";

const client = new Client({
    host : "localhost",
    port : 5432,
    database : "exchange_db",
    user : 'postgres',
    password : "password"
})

async function createTable(){
    await client.connect();
    const query = `CREATE TABLE IF NOT EXISTS trades (
                        id VARCHAR(50) PRIMARY KEY,
                        market VARCHAR(50),
                        price DECIMAL,
                        quantity DECIMAL,
                        timestamp TIMESTAMP,
                        buyer_id VARCHAR(50),
                        seller_id VARCHAR(50))`

    await client.query(query);
    console.log("TABLES CREATED SUCCESSFULLY!!!")
    await client.end();
}

createTable().catch(console.error);