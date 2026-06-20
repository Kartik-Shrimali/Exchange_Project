"use client"
import { usePathname, useRouter } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./basic/Button";
import { useContext, useEffect, useState } from "react";
import { loginContext } from "../context/AuthContext";
export default function Appbar() {
    const pathname = usePathname();
    const router = useRouter();
    const {isLoggedIn, setLogin} = useContext(loginContext)

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) setLogin(true);
    }, [])

    return (
        <div className="text-white border-b border-slate-800">
            <div className="flex justify-between items-center p-2">
                <div className="flex">
                    <div className={`text-xl pl-4 flex flex-col justify-center cursor-pointer text-white`} onClick={() => router.push('/')}>
                        Exchange
                    </div>
                    <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${pathname.startsWith('/markets') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/markets')}>
                        Markets
                    </div>
                    <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${pathname.startsWith('/trade') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/trade/SOL_USDC')}>
                        Trade
                    </div>
                </div>
                <div className="flex">
                    <div className="p-2 mr-2">
                        {isLoggedIn ? <button onClick={() => {
                          localStorage.removeItem("token");
                          setLogin(false)
                          router.push('/register')  
                        }}>LOGOUT</button> : <div><SuccessButton onClick={() => {
                            router.push('/login')
                        }}>LOGIN</SuccessButton>
                            <PrimaryButton onClick={() => {
                                router.push('/register')
                            }}>REGISTER</PrimaryButton></div>}

                    </div>
                </div>
            </div>
        </div>
    )
}