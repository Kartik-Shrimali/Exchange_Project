"use client"

import { useEffect, useState } from "react"
import { getMarkets } from "../utils/httpClient"
import { useRouter } from "next/navigation";

export default function Markets() {
    const router = useRouter();
    const [market , setMarket] = useState<any[]>([""]);

    useEffect(() => {
      async function init(){
         setMarket(await getMarkets());
      }
      init();
    }, [])
    
    return <div className="flex flex-row flex-1">
        <div className="flex flex-col justify-center items-center flex-1 pt-[100px]">
            {market.map((marketName , index) => (
                <div key = {index}>
                    <div className = "cursor-pointer" onClick = {() => {router.push(`/trade/${marketName.symbol}`)}}>
                        {marketName.symbol}
                    </div>
                </div>
            ))}
        </div>
    </div>
}