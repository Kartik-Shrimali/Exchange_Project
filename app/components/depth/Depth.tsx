"use client";

import { useState, useEffect } from "react";
import AskTable from "./AskTable";
import BidTable from "./BidTable";
import { getDepth, getTicker } from "@/app/utils/httpClient"
import { wsClient } from "@/app/utils/wsClient";

export default function Depth({ market }: { market: string }) {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        async function init() {
            try {
                
                getDepth(market).then(d => {
                    setBids(d.bids.reverse());
                    setAsks(d.asks);
                })

                wsClient.subscribe(`depth@${market}`);
                wsClient.registerCallback(`depth@${market}` , (data : {bids : [string,string][], asks : [string ,string][]}) =>{
                    setBids(data.bids);
                    setAsks(data.asks);
                    
                })

            } catch (e) {
                console.log("Error in depth.tsx.Error: ", e);
            }
        }
        init();
        return () =>{
            wsClient.unsubscribe(`depth@${market}`)
        }
    }, [])

    return (
        <div>
            <AskTable asks={asks} />
            {price}
            <BidTable bids={bids} />
        </div>
    )
}