import {Client} from "pg";

export const client = new Client({
    host : "localhost",
    port : 5432,
    database : "exchange_db",
    user : "postgres",
    password : "password"
})

client.connect().then(() =>{
    console.log("DB Client for API connected successfully")
})