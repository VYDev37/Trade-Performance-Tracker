"use client";

import { useState } from "react";
import { axios } from "@/app/lib";

import type { UpdateTransactionReq } from "@/app/types/http/UserRequest";

export default function useUpdateTransaction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTransaction = async (id: number, data: UpdateTransactionReq) => {
        setLoading(true);
        setError(null);

        try {
            await axios.put(`/transactions/update/${id}`, {
                title: data.title,
                notes: data.notes,
                price: Number(data.price),
                reverse: data.reverse
            });
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
