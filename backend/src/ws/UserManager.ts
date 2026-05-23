import {WebSocket} from "ws"

export type UserType = {
    userId : string,
    ws : WebSocket,
    subscriptions : string[]

}

export class UserManager {
    private static instance: UserManager
    private users : Map<string , UserType>;

    private constructor() {
        this.users = new Map();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new UserManager();
        }
        return this.instance;
    }

    public addUser(ws : WebSocket){
        const userId = Math.random().toString(36).substring(2,15);
        this.users.set(userId , {
            userId ,
            ws ,
            subscriptions : []
        })

        return userId;
    }

    public removeUser(userId : string){
        this.users.delete(userId);
    }

    public getUser(userId : string){
        return this.users.get(userId);
    }

    public subscribe(userId : string, channel : string){
        const user = this.getUser(userId);
        if(user){
            user.subscriptions.push(channel);
        }
    }

    public unsubscribe(userId : string , channel : string){
        const user = this.getUser(userId);
        if(user){
           user.subscriptions =  user.subscriptions.filter(o => o !== channel);
        }
    }
}