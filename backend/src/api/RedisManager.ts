import { createClient , RedisClientType } from "redis";
import type { MessagefromApi } from "../types/fromApi";

export class RedisManager{
    private static instance : RedisManager;
    private publisher : RedisClientType;
    private subscriber : RedisClientType;
    private constructor(){
        this.publisher = createClient();
        this.publisher.connect();
        this.subscriber = createClient();
        this.subscriber.connect();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public sendAndAwait(message : MessagefromApi){
        return new Promise((resolve) => {
            const clientId = Math.random().toString(36).substring(2 , 15);
            
            this.subscriber.subscribe(clientId , (response) =>{
                this.subscriber.unsubscribe(clientId);
                resolve(JSON.parse(response))
            })
            
            this.publisher.lPush("messages", JSON.stringify({clientId , message}))
        })
    }
}