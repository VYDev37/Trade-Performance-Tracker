"use client";

import { useState, useMemo } from "react";
import { Search, History, AlertCircle, FilterIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";

import { TransactionTable, TransactionCard } from "@/app/components/transaction";
import { useGetTransactions } from "@/app/hooks";

export default function TransactionHistoryPage() {
    const { transactions, loading, error } = useGetTransactions();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const filteredTransactions = useMemo(() => {
        if (!transactions)
            return [];

        let result = [...transactions];

        if (filterType !== "all") {
            result = result.filter(t => {
                const isCashflow = t.transaction_type === "cashflow";
                if (filterType === "stocks") {
                    return !isCashflow;
                } else {
                    return t.transaction_type === filterType;
                }
            });
        }
        if (searchTerm)
            result = result.filter(t => t.ticker.toLowerCase().includes(searchTerm.toLowerCase()));

        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [transactions, searchTerm, filterType, sortDirection]);

    const toggleSort = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="container py-8 px-4 w-[90%] md:w-[95%] space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <History className="h-8 w-8 text-blue-500 mt-3" />
                        Transaction History
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage your trading activity.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full md:w-[200px] bg-slate-900/50 border-slate-800 focus:ring-blue-500">
                            <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 text-white border-white/10">
                            <SelectGroup>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="stocks">Stocks</SelectItem>
                                <SelectItem value="crypto">Crypto</SelectItem>
                                <SelectItem value="cashflow">Cash Flow</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Ticker (e.g., BBCA)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 bg-slate-900/50 border-slate-800 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {error ? (
                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center justify-center p-12 text-center text-red-400">
                            <AlertCircle className="h-10 w-10 mb-4" />
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop View */}
                    <TransactionTable toggleSort={toggleSort} loading={loading} transactions={filteredTransactions} />

                    {/* Mobile View */}
                    <div className="block md:hidden space-y-4">
                        <TransactionCard loading={loading} transactions={filteredTransactions} />
                    </div>
                </>
            )}
        </div>
    );
}
