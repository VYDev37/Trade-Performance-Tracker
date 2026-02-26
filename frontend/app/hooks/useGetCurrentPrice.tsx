"use client"

import { useState, useEffect, useCallback } from "react";
import axios from "@/app/lib/axios";

export default function useGetCurrentPrice(ticker: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [price, setPrice] = useState<number>(0);

    const fetchPrice = useCallback(async (target: string) => {
        if (!target || target.length < 4) {
            setPrice(0);
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await axios.get(`/position/get-price/${target.toUpperCase()}`);
            setPrice(result.data.price);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to get price.");
            return false;
        } finally {
            setLoading(false);
        }
    }, [ticker]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPrice(ticker);
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [ticker, fetchPrice]);

    return { price, loading, error, refetchPrice: () => fetchPrice(ticker) };
}