import { createClient, type RedisClientType } from "redis";

export class RedisManager{
    private static instance : RedisManager;
    private publisher : RedisClientType

    private constructor(){
        this.publisher = createClient();
        this.publisher.connect();
        console.log("Engine publisher connected");
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new RedisManager();
        }
        return this.instance
    }

    public publishChannel(channel : string , message : string){
        this.publisher.publish(channel , message)
    }

    public pushToQueue(message : string){
        this.publisher.lPush("db_processor",message);
    }
}