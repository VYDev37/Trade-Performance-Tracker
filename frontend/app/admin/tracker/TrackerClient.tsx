"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRightLeft, Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

import { useTransaction } from '@/app/stores';

import { TrackerHeader, TrackerSummary, TrackerTransactionColumn, TrackerCombinedColumn } from '@/app/components/tracker';
import { TrackerMigrationModal } from '@/app/components/shared';

export default function TrackerClient() {
    const refetch = useTransaction((state) => state.refetch);
    const transactions = useTransaction((state) => state.transactions);
    const loading = useTransaction((state) => state.loading);
    const selectedAccount = useTransaction((state) => state.selectedAccount) || "all";
    const setSelectedAccount = useTransaction((state) => state.setSelectedAccount);
    const fetchAccounts = useTransaction((state) => state.fetchAccounts);

    const [limit, setLimit] = useState(10);

    const { incomes, expenses, income, expense, net, balanceTransactions } = useMemo(() => {
        let tx = transactions;
        if (selectedAccount !== "all") {
            const acc = selectedAccount.split("-");
            if (acc.length >= 2)
                tx = tx.filter(t => t.provider === acc[0] && t.account_no === acc[1]);
        }

        const incomes = tx.filter(x => x.transaction_type === "income");
        const expenses = tx.filter(x => x.transaction_type === "expense");

        const income = incomes.reduce((acc, val) => acc + val.price, 0);
        const expense = expenses.reduce((acc, val) => acc + val.price, 0);

        const net = income - expense;

        const balanceTransactions = [...incomes, ...expenses].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());

        return { incomes, expenses, income, expense, net, balanceTransactions };
    }, [transactions, selectedAccount]);

    const visibleIncomes = incomes.slice(0, limit);
    const visibleExpenses = expenses.slice(0, limit);
    const visibleBalanceTransactions = balanceTransactions.slice(0, limit);

    const [isMigrationOpen, setIsMigrationOpen] = useState(false);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);

    const legacyCashTransactions = useMemo(() => {
        return transactions.filter(
            (t) => (t.transaction_type === "income" || t.transaction_type === "expense") && (!t.provider || t.provider === "")
        );
    }, [transactions]);

    console.log(legacyCashTransactions);

    useEffect(() => {
        if (legacyCashTransactions.length > 0 && !hasAutoOpened && !loading) {
            setIsMigrationOpen(true);
            setHasAutoOpened(true);
        }
    }, [legacyCashTransactions, hasAutoOpened, loading]);

    useEffect(() => {
        refetch();
        fetchAccounts("cash_balance");
    }, [refetch, fetchAccounts]);

    return (
        <div className="flex flex-col w-full pt-3 pb-6 space-y-6 md:space-y-8 text-slate-300 font-sans antialiased">
            <TrackerMigrationModal isOpen={isMigrationOpen} onOpenChange={setIsMigrationOpen} />
            <motion.div
                key="tracker-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 md:space-y-8"
            >
                {/* Migration Action Banner */}
                {legacyCashTransactions.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md relative overflow-hidden">
                        {/* Decorative inner glow */}
                        <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-start gap-3 relative z-10">
                            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 shrink-0">
                                <ArrowRightLeft className="w-5 h-5 text-blue-400 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    Unassigned Cash Transactions <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                </h4>
                                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                                    You have {legacyCashTransactions.length} legacy transactions without an assigned bank or wallet account. Migrate them to organize your cash ledger properly.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsMigrationOpen(true)}
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] shrink-0 relative z-10"
                        >
                            Migrate Now
                        </button>
                    </div>
                )}

                <TrackerHeader net={net} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
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
        </div>
    );
}
