"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const loginContext = createContext({
    isLoggedIn: false,
    setLogin: (value : boolean) => { }
});

export  function LoginProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn , setLogin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) setLogin(true);
    } , [])

    return (
        <loginContext.Provider value = {{isLoggedIn , setLogin}}>
            {children}
        </loginContext.Provider>
    ) 
}