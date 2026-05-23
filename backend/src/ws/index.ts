import {WebSocketServer} from "ws";
import { UserManager } from "./UserManager";
import type { IncomingMessage } from "./types/in";
import { SUBSCRIBE, UNSUBSCRIBE } from "./types/in";
import { SubscriptionManager } from "./SubscriptionManager";

const wss = new WebSocketServer({port : 3001});

wss.on("connection" , (ws) =>{
    console.log("Client connected");
    const userId = UserManager.getInstance().addUser(ws);
    ws.on('message' , (message) =>{
        const parsedMessage : IncomingMessage = JSON.parse(message.toString()); 

        if(parsedMessage.method === SUBSCRIBE){
            parsedMessage.params.forEach(channel => {
                SubscriptionManager.getInstance().subscribe(userId , channel);
            })
        }

        if(parsedMessage.method === UNSUBSCRIBE){
            parsedMessage.params.forEach(channel => {
                SubscriptionManager.getInstance().unsubscribe(userId , channel)
            })
        }
        console.log("Message received: ", message.toString());
    })

    ws.on('close' , () =>{
        SubscriptionManager.getInstance().userLeft(userId);
        UserManager.getInstance().removeUser(userId)
        console.log("Client Disconnected")

    })
})

console.log("Websocket server running on port 3001")