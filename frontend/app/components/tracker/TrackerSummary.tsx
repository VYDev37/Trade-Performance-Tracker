import { TrendingUp } from 'lucide-react';
import { Formatter } from '@/app/lib';

interface TrackerSummaryProps {
    income: number;
    expense: number;
}

export default function TrackerSummary({ income, expense }: TrackerSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Income Summary */}
            <div className="bg-[#14181f] border border-slate-800 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Total Inflow</p>
                    <p className="text-lg md:text-xl font-bold text-white">{Formatter.toCurrency(income)}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
            </div>

            {/* Expense Summary */}
            <div className="bg-[#14181f] border border-slate-800 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Total Outflow</p>
                    <p className="text-lg md:text-xl font-bold text-white">{Formatter.toCurrency(expense)}</p>
                </div>
                <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center rotate-90">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                </div>
            </div>
        </div>
    );
}
