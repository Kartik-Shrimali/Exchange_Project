"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react"
import { loginContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:3001/api/v1"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState("")
    const router = useRouter();
    const login = useContext(loginContext);

    async function sendRequest() {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                email,
                password
            })

            const token = response.data.token;

            localStorage.setItem("token", token);
            login.setLogin(true);
            router.push('/')

        }catch(e){
            setError("Failed to login check you email and password")
        }
    }

    return (
        <div>
            <input placeholder="Email" onChange={(e) => {
                setEmail(e.target.value)
            }}></input>
            <input placeholder="Password" onChange={(e) => {
                setPassword(e.target.value)
            }}></input>
            <button onClick={sendRequest}>LOGIN</button>
            {error}
        </div>
    )
}