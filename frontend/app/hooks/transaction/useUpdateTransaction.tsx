"use client";

import { useState } from "react";
import { axios } from "@/app/lib";

interface UpdateTransactionReq {
    title: string;
    notes: string;
    price: number;
}

export default function useUpdateTransaction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTransaction = async (id: number, data: UpdateTransactionReq) => {
        setLoading(true);
        setError(null);

        try {
            await axios.put(`/transactions/update/${id}`, data);
            return true;
        } catch (err: any) {
            setError(err.message || "Failed to update transaction.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateTransaction, loading, error };
}
