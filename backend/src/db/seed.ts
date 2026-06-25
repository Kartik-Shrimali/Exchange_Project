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

    await client.query(`CREATE TABLE IF NOT EXISTS trades (
    id VARCHAR(50),
    market VARCHAR(50),
    price DECIMAL,
    quantity DECIMAL,
    timestamp TIMESTAMP NOT NULL,
    buyer_id VARCHAR(50),
    seller_id VARCHAR(50),
    is_buyer_maker BOOLEAN,
    PRIMARY KEY (id, timestamp)
    )`);

    await client.query(`CREATE EXTENSION IF NOT EXISTS timescaledb`);
    await client.query(`SELECT create_hypertable('trades' , 'timestamp' , if_not_exists => TRUE, migrate_data => TRUE) `);

    const intervals = [
        { name: 'klines_1m',  bucket: '1 minute' },
        { name: 'klines_5m',  bucket: '5 minutes' },
        { name: 'klines_15m', bucket: '15 minutes' },
        { name: 'klines_30m', bucket: '30 minutes' },
        { name: 'klines_1h',  bucket: '1 hour' },
        { name: 'klines_4h',  bucket: '4 hours' },
        { name: 'klines_1d',  bucket: '1 day' },
        { name: 'klines_1w',  bucket: '1 week' },
    ];

    for (const interval of intervals) {
        await client.query(`
            CREATE MATERIALIZED VIEW IF NOT EXISTS ${interval.name}
            WITH (timescaledb.continuous) AS 
            SELECT
                time_bucket('${interval.bucket}', timestamp) AS bucket,
                market,
                FIRST(price, timestamp) AS open,
                MAX(price) AS high,
                MIN(price) AS low,
                LAST(price, timestamp) AS close,
                SUM(quantity) AS volume
            FROM trades
            GROUP BY bucket, market
            WITH NO DATA`);
        console.log(`Created view: ${interval.name}`);
    }

    await client.query(`CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(50) UNIQUE,
        password VARCHAR(100))`)

    console.log("TABLES CREATED SUCCESSFULLY!!!")
    await client.end();
}

createTable().catch(console.error);