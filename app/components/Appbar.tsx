"use client"
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { loginContext } from "../context/AuthContext";

export default function Appbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isLoggedIn, setLogin } = useContext(loginContext)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setLogin(true);
    }, [])

    return (
        <div className="text-white border-b border-slate-800 bg-[#0e0f14]">
            <div className="flex justify-between items-center px-6 py-3">
                <div className="flex items-center gap-8">
                    <div
                        className="text-lg font-bold text-white cursor-pointer"
                        onClick={() => router.push('/')}
                    >
                        Exchange
                    </div>
                    <div
                        className={`text-sm cursor-pointer transition hover:text-white ${pathname.startsWith('/markets') ? 'text-white font-medium' : 'text-slate-400'}`}
                        onClick={() => router.push('/markets')}
                    >
                        Markets
                    </div>
                    <div
                        className={`text-sm cursor-pointer transition hover:text-white ${pathname.startsWith('/trade') ? 'text-white font-medium' : 'text-slate-400'}`}
                        onClick={() => router.push('/trade/TATA_INR')}
                    >
                        Trade
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setLogin(false);
                                router.push('/login');
                            }}
                            className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="text-sm font-semibold bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg transition"
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}