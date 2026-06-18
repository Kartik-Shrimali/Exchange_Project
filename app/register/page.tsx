"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react"

const BASE_URL = "http://localhost:3001/api/v1"

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState("");
    const router = useRouter();


    async function sendRequest() {
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, {
                name,
                email,
                password
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            router.push("/");

        } catch (e) {
            setError("Login failed  check your email and password")
        }



    }

    return (
        <div>
            <input placeholder="Name" onChange={(e) => {
                setName(e.target.value)
            }}></input>
            <input placeholder="Email" onChange={(e) => {
                setEmail(e.target.value)
            }}></input>
            <input className = "text-black" placeholder="Password" onChange={(e) => {
                setPassword(e.target.value);
            }}></input>
            <button onClick={sendRequest}>REGISTER</button>
            {error}
        </div>
    )
}