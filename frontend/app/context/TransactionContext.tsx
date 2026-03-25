"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { axios } from "@/app/lib";
import { usePathname } from "next/navigation";
import type { TransactionInfo } from "@/app/types/user/TransactionInfo";

type TransactionContextType = {
    transactions: TransactionInfo[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<boolean>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<TransactionInfo[]>([]);

    const pathname = usePathname();

    const fetchTransactions = useCallback(async () => {
        if (!pathname.startsWith("/admin")) {
            setLoading(false);
            return false;
        }

        setError(null);
        setLoading(true);

        try {
            const result = await axios.get("/transactions/my-info");
            setTransactions(result.data.transactions || []);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to get transactions.");
            return false;
        } finally {
            setLoading(false);
        }
    }, [pathname]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const value = useMemo(
        () => ({
            transactions,
            loading,
            error,
            refetch: fetchTransactions,
        }),
        [transactions, loading, error, fetchTransactions]
    );

    return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error("useTransaction must be used within a TransactionProvider");
    }
    return context;
};
