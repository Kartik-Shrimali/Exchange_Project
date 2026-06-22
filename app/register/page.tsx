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
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-[#1a1b23] rounded-2xl p-8 border border-slate-800">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome </h1>
                <p className="text-slate-400 text-sm mb-8">Create a new account</p>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Name</label>
                        <input
                            placeholder="Test Name"
                            className="bg-[#0e0f14] border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-slate-500"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                        Register
                    </button>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <span className="text-white cursor-pointer hover:underline" onClick={() => router.push('/login')}>
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}