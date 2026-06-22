"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react"
import { loginContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:3001/api/v1"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const router = useRouter();
    const login = useContext(loginContext);

    async function sendRequest() {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password })
            const token = response.data.token;
            localStorage.setItem("token", token);
            login.setLogin(true);
            router.push('/')
        } catch (e) {
            setError("Failed to login. Check your email and password.")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-[#1a1b23] rounded-2xl p-8 border border-slate-800">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-slate-400 text-sm mb-8">Sign in to your account</p>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Email</label>
                        <input
                            placeholder="you@example.com"
                            className="bg-[#0e0f14] border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-slate-500"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="bg-[#0e0f14] border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-slate-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                        onClick={sendRequest}
                        className="mt-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-lg transition"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <span className="text-white cursor-pointer hover:underline" onClick={() => router.push('/register')}>
                            Register
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}