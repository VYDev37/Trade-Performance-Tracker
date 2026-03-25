"use client"

import { useState } from "react";
import axios from "@/app/lib/axios";

import { useUser } from "@/app/context/UserContext";
import type { UserBalanceReq } from "@/app/types/http/UserRequest";

export default function useUpdateBalance() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshProfile } = useUser();

    const updateBalance = async (formData: UserBalanceReq) => {
        setLoading(true);
        setError(null);

        try {
            await axios.post("/user/update-balance", {
                amount: Number(formData.amount),
                fee: Number(formData.fee),
                mode: formData.mode,
                bank_src: formData.bank_src,
                note: formData.note
            });

            await refreshProfile();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update balance.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateBalance, loading, error };
}