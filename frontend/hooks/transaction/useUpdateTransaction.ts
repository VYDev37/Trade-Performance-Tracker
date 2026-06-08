"use client";

import { useState } from "react";
import { axios } from "@/lib";
import z from "zod";

import { UpdateTransactionReqSchema, type UpdateTransactionReq } from "@/schemas/transaction.schema";

export default function useUpdateTransaction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTransaction = async (id: number, data: UpdateTransactionReq) => {
        setLoading(true);
        setError(null);

        try {
            const validated = UpdateTransactionReqSchema.parse({
                title: data.title,
                notes: data.notes,
                price: Number(data.price),
                reverse: data.reverse
            });

            await axios.put(`/transactions/update/${id}`, {
                title: validated.title,
                notes: validated.notes,
                price: validated.price,
                reverse: validated.reverse
            });
            return true;
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                setError(err.issues.map((issue) => issue.message).join(", "));
            } else {
                setError(err.message || "Failed to update transaction.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateTransaction, loading, error };
}
