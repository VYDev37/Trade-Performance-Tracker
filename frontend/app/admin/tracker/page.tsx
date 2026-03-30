"use client";

import { ArrowDown } from 'lucide-react';
import { useTransaction } from '@/app/context/TransactionContext';
import { useEffect, useState } from 'react';
import { TrackerHeader, TrackerSummary, TrackerTransactionColumn, TrackerCombinedColumn } from '@/app/components/tracker';

export default function Tracker() {
    const { transactions, refetch } = useTransaction();
    const [limit, setLimit] = useState(10);

    const incomes = transactions.filter(x => x.transaction_type === "income");
    const expenses = transactions.filter(x => x.transaction_type === "expense");

    const income = incomes.reduce((acc, val) => acc + val.price, 0);
    const expense = expenses.reduce((acc, val) => acc + val.price, 0);

    const net = income + expense;

    const visibleIncomes = incomes.slice(0, limit);
    const visibleExpenses = expenses.slice(0, limit);

    const balanceTransactions = [...incomes, ...expenses].sort((a,b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    const visibleBalanceTransactions = balanceTransactions.slice(0, limit);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div className="flex flex-col w-[90%] md:w-[95%] pt-3 pb-6 space-y-6 md:space-y-8 text-slate-300 font-sans antialiased">
            <TrackerHeader net={net} />

            <TrackerSummary income={income} expense={expense} />

            {/* Mobile Combined View */}
            <div className="block md:hidden">
                <TrackerCombinedColumn
                    title="Recent Activity"
                    items={visibleBalanceTransactions}
                    totalCount={balanceTransactions.length}
                    onViewAll={() => setLimit(balanceTransactions.length)}
                />
            </div>

            {/* Desktop Separated View */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 md:gap-8">
                <TrackerTransactionColumn
                    title="Inflow Details"
                    type="inflow"
                    items={visibleIncomes}
                    totalCount={incomes.length}
                    onViewAll={() => setLimit(Math.max(incomes.length, expenses.length))}
                />

                <TrackerTransactionColumn
                    title="Outflow Details"
                    type="outflow"
                    items={visibleExpenses}
                    totalCount={expenses.length}
                    onViewAll={() => setLimit(Math.max(incomes.length, expenses.length))}
                />
            </div>

            <footer className="pt-6 md:pt-8 text-center min-h-[4rem]">
                {(incomes.length > limit || expenses.length > limit || balanceTransactions.length > limit) && (
                    <button
                        onClick={() => setLimit(prev => prev + 10)}
                        className="text-[11px] text-slate-500 hover:text-white transition-colors flex items-center gap-2 mx-auto bg-slate-900/50 hover:bg-slate-800 py-2 px-4 rounded-full border border-slate-800">
                        View more <ArrowDown className="w-3 h-3" />
                    </button>
                )}
            </footer>
        </div>
    );
}