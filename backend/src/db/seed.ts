import { Client } from "pg";

const client = new Client({
    host: "localhost",
    port: 5432,
    database: "exchange_db",
    user: 'postgres',
    password: "password"
})

async function createTable() {
    await client.connect();

    
    // await client.query(`DROP TABLE IF EXISTS trades CASCADE`);
    await client.query(`CREATE TABLE IF NOT EXISTS trades (
    id VARCHAR(50),
    market VARCHAR(50),
    price DECIMAL,
    quantity DECIMAL,
    timestamp TIMESTAMP NOT NULL,
    buyer_id VARCHAR(50),
    seller_id VARCHAR(50),
    PRIMARY KEY (id, timestamp)
    )`);

    await client.query(`CREATE EXTENSION IF NOT EXISTS timescaledb`);
    await client.query(`SELECT create_hypertable('trades' , 'timestamp' , if_not_exists => TRUE, migrate_data => TRUE) `);

    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m
        WITH (timescaledb.continuous) AS 
        SELECT
            time_bucket('1 minute',timestamp) AS bucket,
            market,
            FIRST(price,timestamp) AS open,
            MAX(price) AS high,
            MIN(price) AS low,
            LAST(price,timestamp) AS close,
            SUM(quantity) AS volume
        From trades
        GROUP BY bucket,market
        WITH NO DATA`);

        await client.query(`CREATE TABLE IF NOT EXISTS users(
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(50),
            email VARCHAR(50) UNIQUE,
            password VARCHAR(100))`)
    console.log("TABLES CREATED SUCCESSFULLY!!!")
    await client.end();
}

createTable().catch(console.error);