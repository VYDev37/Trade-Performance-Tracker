import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Formatter } from '@/app/lib';
import { ManageBalanceSheet } from '@/app/components/profile';

interface TrackerHeaderProps {
    net: number;
}

export default function TrackerHeader({ net }: TrackerHeaderProps) {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6 md:pb-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 uppercase tracking-[0.15em] text-[10px] font-bold">
                    <CreditCard className="w-3 h-3" />
                    <span>Available Liquidity</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    {Formatter.toCurrency(net)}
                </h1>
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button className="flex-1 md:flex-none h-9 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-all border border-slate-700/50">
                    History
                </Button>
                <ManageBalanceSheet mode="cash">
                    <Button className="flex-1 md:flex-none h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2">
                        <Plus className="w-3 h-3" />
                        Add
                    </Button>
                </ManageBalanceSheet>
            </div>
        </header>
    );
}
