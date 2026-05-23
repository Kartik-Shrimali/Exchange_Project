import { createClient, type RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
    private static instance: SubscriptionManager
    private redisClient: RedisClientType;
    private subscriptions: Map<string, string[]>

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
        console.log("Redis client connected.Ws->subscriptionManager");
        this.subscriptions = new Map();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }

    public subscribe(userId: string, channel: string) {
        const existing = this.subscriptions.get(channel) || [];
        existing.push(userId);

        this.subscriptions.set(channel, existing);

        if (existing.length == 1) {
            this.redisClient.subscribe(channel, (message) => {
                const subscriber = this.subscriptions.get(channel);
                subscriber?.forEach(subscriberUserId => {
                    const user = UserManager.getInstance().getUser(subscriberUserId);
                    user?.ws.send(message);
                })
            })
        }
    }

    public unsubscribe(userId: string, channel: string) {
        let existing = this.subscriptions.get(channel) || [];
        existing = existing.filter(o => o !== userId);

        this.subscriptions.set(channel , existing);

        if(existing.length == 0){
            this.redisClient.unsubscribe(channel);
            this.subscriptions.delete(channel);
        }
    }

    public userLeft(userId : string){
        const user = UserManager.getInstance().getUser(userId);
        user?.subscriptions.forEach(channel => {
            this.unsubscribe(userId , channel);
        })
    }
}