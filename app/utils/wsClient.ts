export class WsClient{
    private static instance : WsClient;
    private ws : WebSocket;
    private callbacks : Map<string , Function>;

    private constructor(){
        this.ws = new WebSocket(`ws://localhost:3002`);
        this.ws.onopen = () => console.log("Connected to WebSocket");
        this.ws.onmessage = (message) =>{
            const parsedMessage = JSON.parse(message.data);
            const channel = parsedMessage.stream;
            const callback = this.callbacks.get(channel);
            if(callback) callback(parsedMessage.data);
        }
        this.callbacks = new Map();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new WsClient();
        }
        return this.instance;
    }

    public subscribe(channel : string){
        this.ws.send(JSON.stringify({
            method : "SUBSCRIBE",
            params : [channel]
        }))
    }

    public unsubscribe(channel : string){
        this.ws.send(JSON.stringify({
            method : "UNSUBSCRIBE",
            params : [channel]
        }))
    }

    public registerCallback(channel : string , callback : Function){
        this.callbacks.set(channel , callback);
    }
}

export const wsClient = WsClient.getInstance(); 