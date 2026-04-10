"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, History, AlertCircle, FilterIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";

import { TransactionTable, TransactionCard } from "@/app/components/transaction";
import { useUser } from "@/app/context/UserContext";
import { useTransaction } from "@/app/context/TransactionContext";

export default function TransactionHistoryPage() {
    const { transactions, loading, error } = useTransaction();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const { user } = useUser();

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    const filteredTransactions = useMemo(() => {
        if (!transactions)
            return [];

        const tx = transactions.filter(x => x.transaction_type !== "income" && x.transaction_type !== "expense");
        let result = tx;

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

        const withTime = result.map(t => ({
            ...t,
            _time: new Date(t.created_at).getTime()
        }));

        withTime.sort((a, b) => {
            return sortDirection === 'asc' ? a._time - b._time : b._time - a._time;
        });

        return withTime.map(({ _time, ...t }) => t);
    }, [transactions, searchTerm, filterType, sortDirection]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTransactions, currentPage]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const renderPaginationDots = () => {
        let pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push('...');
            }
        }
        pages = pages.filter((item, index) => item !== '...' || pages[index - 1] !== '...');

        return pages.map((page, index) => {
            if (page === '...') {
                return <span key={`ellipsis-${index}`} className="px-2 text-slate-500">...</span>;
            }
            return (
                <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 p-0 ${currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300"}`}
                >
                    {page}
                </Button>
            );
        });
    };

    const toggleSort = useCallback(() => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

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
                    <TransactionTable toggleSort={toggleSort} username={user?.username || "Guest Account"} loading={loading} transactions={paginatedTransactions} />

                    {/* Mobile View */}
                    <div className="block md:hidden space-y-4">
                        <TransactionCard loading={loading} transactions={paginatedTransactions} />
                    </div>

                    {filteredTransactions.length > 0 && !loading && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4">
                            <div className="text-sm text-slate-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 h-8"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>
                                <div className="flex items-center gap-1">
                                    {renderPaginationDots()}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 h-8"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
