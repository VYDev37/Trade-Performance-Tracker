"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

import { useTransaction } from '@/app/context/TransactionContext';

import { Skeleton } from '@/components/ui/skeleton';
import { TrackerHeader, TrackerSummary, TrackerTransactionColumn, TrackerCombinedColumn } from '@/app/components/tracker';

export default function Tracker() {
    const { transactions, loading, refetch } = useTransaction();
    const [limit, setLimit] = useState(10);

    const { incomes, expenses, income, expense, net, balanceTransactions } = useMemo(() => {
        const incomes = transactions.filter(x => x.transaction_type === "income");
        const expenses = transactions.filter(x => x.transaction_type === "expense");

        const income = incomes.reduce((acc, val) => acc + val.price, 0);
        const expense = expenses.reduce((acc, val) => acc + val.price, 0);

        const net = income - expense;

        const balanceTransactions = [...incomes, ...expenses].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());

        return { incomes, expenses, income, expense, net, balanceTransactions };
    }, [transactions]);

    const visibleIncomes = incomes.slice(0, limit);
    const visibleExpenses = expenses.slice(0, limit);
    const visibleBalanceTransactions = balanceTransactions.slice(0, limit);

    const [isInitializing, setisInitializing] = useState(true);

    useEffect(() => {
        if (!loading && transactions.length >= 0) {
            setisInitializing(false);
        }
    }, [loading, transactions]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div className="flex flex-col w-[90%] md:w-[95%] pt-3 pb-6 space-y-6 md:space-y-8 text-slate-300 font-sans antialiased">
            {loading && isInitializing ? (
                <motion.div
                    key="loading-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                >
                    <Skeleton className="h-32 md:h-40 w-full rounded-2xl bg-slate-900/50 border border-slate-800" />
                    <Skeleton className="h-28 md:h-32 w-full rounded-2xl bg-slate-900/50 border border-slate-800" />
                    <Skeleton className="h-[400px] w-full rounded-2xl bg-slate-900/50 border border-slate-800" />
                </motion.div>
            ) : (
                <motion.div
                    key="tracker-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 md:space-y-8"
                >
                    <TrackerHeader net={net} />
                    <TrackerSummary income={income} expense={expense} />

                    <AnimatePresence mode="popLayout">
                        {/* Mobile Combined View */}
                        <motion.div key="mobile-tracker" className="block md:hidden" layout>
                            <TrackerCombinedColumn
                                title="Recent Activity"
                                items={visibleBalanceTransactions}
                                totalCount={balanceTransactions.length}
                                onViewAll={() => setLimit(balanceTransactions.length)}
                            />
                        </motion.div>

                        {/* Desktop Separated View */}
                        <motion.div key="desktop-tracker" className="hidden md:grid md:grid-cols-2 gap-6 md:gap-8" layout>
                            <TrackerTransactionColumn
                                title="Inflow Details"
                                type="inflow"
                                items={visibleIncomes}
                                onViewAll={() => setLimit(Math.max(incomes.length, expenses.length))}
                            />

                            <TrackerTransactionColumn
                                title="Outflow Details"
                                type="outflow"
                                items={visibleExpenses}
                                onViewAll={() => setLimit(Math.max(incomes.length, expenses.length))}
                            />
                        </motion.div>

                        <footer className="pt-6 md:pt-8 text-center min-h-[4rem]">
                            {(incomes.length > limit || expenses.length > limit || balanceTransactions.length > limit) && (
                                <button
                                    onClick={() => setLimit(prev => prev + 10)}
                                    className="text-[11px] text-slate-500 hover:text-white transition-colors flex items-center gap-2 mx-auto bg-slate-900/50 hover:bg-slate-800 py-2 px-4 rounded-full border border-slate-800">
                                    View more <ArrowDown className="w-3 h-3" />
                                </button>
                            )}
                        </footer>
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}