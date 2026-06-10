import {Client} from "pg";

const client = new Client({
    host : "localhost",
    port : 5432,
    database : "exchange_db",
    user : "postgres",
    password : "password"
})

async function refreshViews(){
    await client.query(`CALL refresh_continuous_aggregate('klines_1m' , NULL , NULL)`);
    console.log("Klines Refreshed");
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