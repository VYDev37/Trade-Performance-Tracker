"use client"

import { useState, useEffect, useCallback } from "react";
import axios from "@/app/lib/axios";

import type { TransactionInfo } from "@/app/types/user/TransactionInfo";

export default function useGetTransactions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<TransactionInfo[]>([]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);

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
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return { transactions, loading, error, refetch: fetchTransactions };
}