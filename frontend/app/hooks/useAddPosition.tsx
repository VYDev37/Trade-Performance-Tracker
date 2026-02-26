"use client"

import { useState } from "react";
import axios from "@/app/lib/axios";

import { useUser } from "@/app/context/UserContext";
import type { PortfolioAddReq } from "@/app/types/user/PortfolioInfo";

export default function useAddPosition() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshProfile } = useUser();

    const addPosition = async (position: "buy" | "sell", formData: PortfolioAddReq, position_type: "crypto" | "futures" | "stocks") => {
        setLoading(true);
        setError(null);

        try {
            await axios.post(`/position/add/${position}`, {
                ticker: formData.ticker.toUpperCase(),
                total_qty: Number(formData.qty),
                invested_total: Number(formData.inv),
                fee: Number(formData.fee),
                position_type
            });

            await refreshProfile();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add position");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { addPosition, loading, error };
}