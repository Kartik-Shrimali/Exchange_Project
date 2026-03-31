"use client"
import { usePathname, useRouter } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./basic/Button";
export default function Appbar() {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <div>
            <div className={pathname === '/' ? 'active' : ''} onClick={() => {
                router.push('/')
            }}>Exchange</div>

            <div className={pathname.startsWith('/markets') ? 'active' : ''} 
                onClick={() => {
                    router.push('/markets')
                }}>Markets
            </div>
            <div className={pathname.startsWith('/trade') ? 'active' : ''} onClick={()=>{
                router.push('/trade/SOL_USDC')
            }}>
                Trade
            </div>
            <div>
                <PrimaryButton >Withdraw</PrimaryButton>
                <SuccessButton >Deposit</SuccessButton>
            </div>
        </div>
    )
}