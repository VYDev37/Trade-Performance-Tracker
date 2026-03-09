import { cn } from "@/lib/utils";
import { Formatter } from "@/app/lib";

import type { TransactionInfo } from "@/app/types/user/TransactionInfo";

interface PnLReportProps {
    transaction: TransactionInfo;
    userNickname: string;
    cardRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PnLReport({ transaction, userNickname, cardRef }: PnLReportProps) {
    const roiPercentage = (transaction.realized_pnl / transaction.base_price) * 100;
    const isProfit = transaction.realized_pnl > 0;

    return (
        <div ref={cardRef} className="w-[500px] aspect-square p-10 bg-zinc-950 text-white relative flex flex-col justify-between border border-white/10 select-none">
            <div className={cn("absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[100px] opacity-25",
                isProfit ? "bg-emerald-600" : "bg-red-600")} />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="text-sky-500 font-black tracking-tighter text-3xl leading-none">
                        <span className="text-white">TRADE</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
                        {transaction.transaction_type} Report • {userNickname}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Date</p>
                    <p className="text-xs font-medium text-zinc-300">
                        {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Main Stats: The "Profit/Loss" Highlight */}
            <div className="relative z-10 flex flex-col items-center py-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="h-px w-8 bg-zinc-800"></span>
                    <h2 className="text-2xl font-bold tracking-[0.3em] text-zinc-400">IDX: {transaction.ticker}</h2>
                    <span className="h-px w-8 bg-zinc-800"></span>
                </div>

                <div className={cn(
                    "text-6xl font-black tracking-tighter leading-none my-2",
                    isProfit ? "text-emerald-400" : "text-red-400"
                )}>
                    {isProfit ? "+" : ""}{roiPercentage.toFixed(2)}%
                </div>

                <div className={cn(
                    "px-6 py-2 rounded-full font-black text-xl flex items-center gap-2",
                    isProfit ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                    Rp{Formatter.toLocale(Math.abs(transaction.realized_pnl))}
                </div>
            </div>

            {/* Transaction Details Footer */}
            <div className="relative z-10 grid grid-cols-2 gap-y-6 pt-10 border-t border-white/5">
                <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Entry Avg Price</p>
                    <p className="text-xl font-bold font-mono">
                        {Formatter.toLocale(transaction.price_per_unit)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Sell Avg Price</p>
                    <p className="text-xl font-bold font-mono">
                        {Formatter.toLocale(transaction.price / transaction.quantity)}
                    </p>
                </div>
                <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Fee</p>
                    <p className="text-sm font-bold text-zinc-400">
                        Rp{Formatter.toLocale(transaction.transaction_fee)}
                    </p>
                </div>
                <div className="flex justify-end items-center">
                    {/* Logo atau QR Code Placeholder */}
                    <div className="h-14 w-14 bg-white p-1 rounded-lg">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://google.com`} alt="QR" />
                    </div>
                </div>
            </div>
        </div>
    );
};