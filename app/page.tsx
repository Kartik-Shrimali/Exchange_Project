"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-6xl font-bold">MyExchange</h1>
        <p className="text-slate-400 text-xl">The fastest and most secure crypto exchange</p>
        <div className="flex gap-4 mt-4">
          <button 
            className="bg-greenPrimaryButtonBackground text-black font-semibold px-8 py-3 rounded-xl hover:opacity-90"
            onClick={() => router.push("/trade/BTC_INR")}
          >
            Start Trading
          </button>
          <button 
            className="border border-slate-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-slate-800"
            onClick={() => router.push("/markets")}
          >
            View Markets
          </button>
        </div>
      </div>
    </div>
  );
}