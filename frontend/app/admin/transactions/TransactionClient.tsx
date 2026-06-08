"use client";

import { useState, useMemo } from "react";
import { Search, History, AlertCircle, FilterIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";

import { TransactionTable, TransactionCard } from "@/components/transaction";
import { PaginationControls } from "@/components/shared";
import { useUser } from "@/stores";
import { useTransaction } from "@/stores";
import { useAdminTable } from "@/hooks/table";
import type { AvailableAccount, TransactionInfo } from "@/schemas/transaction.schema";

export default function TransactionClient() {
    const error = useTransaction((state) => state.error);
    const transactions = useTransaction((state) => state.transactions);
    const loading = useTransaction((state) => state.loading);

    const [filterType, setFilterType] = useState("all");
    const [filterProvider, setFilterProvider] = useState("all");

    const user = useUser((state) => state.user);

    const uniqueAccounts = useMemo(() => {
        const accs: AvailableAccount[] = [];
        const seen = new Set<string>();

        (transactions || []).forEach(item => {
            if (item.provider && item.account_no) {
                const key = `${item.provider}-${item.account_no}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    accs.push({ provider_name: item.provider, account_no: item.account_no });
                }
            }
        });
        return accs;
    }, [user]);


    const tableConfig = useMemo(() => ({
        itemsPerPage: 15,
        searchField: (item: any, term: string) => item.ticker.toLowerCase().includes(term),
        sortField: (a: any, b: any, dir: "asc" | "desc") => {
            const timeA = a.created_at.getTime();
            const timeB = b.created_at.getTime();
            return dir === "asc" ? timeA - timeB : timeB - timeA;
        },
        filterFn: (t: TransactionInfo) => {
            if (t.transaction_type === "income" || t.transaction_type === "expense") {
                return false;
            }
            // Type filter
            if (filterType !== "all") {
                const isCashflow = t.transaction_type === "cashflow";
                if (filterType === "stocks") {
                    if (isCashflow) return false;
                } else if (t.transaction_type !== filterType) {
                    return false;
                }
            }
            // Provider filter
            if (filterProvider !== "all") {
                const [provider, account_no] = filterProvider.split("-");
                return provider === t.provider && account_no === t.account_no;
            }
            return true;
        }
    }), [filterType, filterProvider]);

    const {
        searchTerm,
        setSearchTerm,
        sortDirection,
        currentPage,
        setCurrentPage,
        filteredItems,
        paginatedItems,
        totalPages,
        toggleSort
    } = useAdminTable(transactions, tableConfig);

    return (
        <div className="container py-8 px-4 w-full space-y-8">
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
                                <SelectItem value="cashflow">Cash Flow</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={filterProvider} onValueChange={setFilterProvider}>
                        <SelectTrigger className="w-full md:w-[200px] bg-slate-900/50 border-slate-800 focus:ring-blue-500">
                            <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="All Providers" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 text-white border-white/10">
                            <SelectGroup>
                                <SelectItem value="all">All Providers</SelectItem>
                                {uniqueAccounts && uniqueAccounts.map((item, id) => (
                                    <SelectItem key={id} value={`${item.provider_name}-${item.account_no}`}>{item.provider_name} - {item.account_no}</SelectItem>
                                ))}
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
                    <TransactionTable toggleSort={toggleSort} username={user?.username || "Guest Account"} loading={loading} transactions={paginatedItems} />

                    {/* Mobile View */}
                    <div className="block md:hidden space-y-4">
                        <TransactionCard loading={loading} transactions={paginatedItems} />
                    </div>

                    {!loading && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalEntries={filteredItems.length}
                            itemsPerPage={15}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}