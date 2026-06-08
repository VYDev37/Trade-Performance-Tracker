
import { Plus, CreditCard, FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Formatter } from '@/lib';
import { ManageBalanceSheet } from '@/components/profile';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransaction } from '@/stores';

interface TrackerHeaderProps {
    net: number;
    selectedAccount: string;
    setSelectedAccount: (account: string) => void;
}

export default function TrackerHeader({ net, selectedAccount, setSelectedAccount }: TrackerHeaderProps) {
    const availableAccounts = useTransaction((state) => state.availableAccounts);

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6 md:pb-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 uppercase tracking-[0.15em] text-[10px] font-bold">
                    <CreditCard className="w-3 h-3" />
                    <span>Available Liquidity</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    {Formatter.formatCurrency(net)}
                </h1>
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 items-center">
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="w-full md:w-[180px] bg-slate-900/50 border-slate-800 focus:ring-blue-500 text-xs font-semibold h-9 rounded-lg">
                        <FilterIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        <SelectValue placeholder="All Accounts" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 text-white border-white/10">
                        <SelectGroup>
                            <SelectItem value="all">All Accounts</SelectItem>
                            {availableAccounts && availableAccounts.map((acc, id) => (
                                <SelectItem key={id} value={`${acc.provider_name}-${acc.account_no}`}>
                                    {acc.provider_name} - {acc.account_no}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

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
