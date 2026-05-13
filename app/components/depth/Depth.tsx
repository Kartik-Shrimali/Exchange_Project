"use client";

import {useState, useEffect} from "react";
import AskTable from "./AskTable";
import BidTable from "./BidTable";
import {getDepth, getTicker} from "@/app/utils/httpClient"

export default function Depth({market} : {market : string}){
    const [bids , setBids] = useState<[string,string][]>([]);
    const [asks , setAsks] = useState<[string,string][]>([]);
    const [price, setPrice] = useState<string>();

    useEffect(()=>{
        getDepth(market).then(d => {
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.lastPrice))
    },[])

    return (
        <div>
            <AskTable asks = {asks}/>
            {price}
            <BidTable bids = {bids}/>
        </div>
    )
}