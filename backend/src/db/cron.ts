import {Client} from "pg";

const client = new Client({
    host : "localhost",
    port : 5432,
    database : "exchange_db",
    user : "postgres",
    password : "password"
})

const views = ['klines_1m', 'klines_5m', 'klines_15m', 'klines_30m', 'klines_1h', 'klines_4h', 'klines_1d', 'klines_1w'];

async function refreshViews(){
    for(const view of views){
        await client.query(`CALL refresh_continuous_aggregate('${view}' , NULL , NULL)`);
        console.log(`${view} refreshed`);
    }
}

async function main(){
    await client.connect();
    console.log("Cron job started");

    await refreshViews();

    setInterval(async () =>{
        await refreshViews();
    } , 1000 * 60)
}

main().catch(console.error);