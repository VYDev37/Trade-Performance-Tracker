"use client"

import { useState, useEffect } from "react";
import useSWR from "swr";
import { axios } from "@/app/lib";

const fetcher = (url: string) => axios.get(url).then(res => res.data.price);

export default function useGetCurrentPrice(ticker: string) {
    const [debouncedTicker, setDebouncedTicker] = useState(ticker);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTicker(ticker);
        }, 800);

        return () => clearTimeout(handler);
    }, [ticker]);

    const shouldFetch = Boolean(debouncedTicker && debouncedTicker.length >= 4);
    const { data: price, error, isLoading, mutate } = useSWR(
        shouldFetch ? `/position/get-price/${debouncedTicker.toUpperCase()}` : null,
        fetcher,
        {
            refreshInterval: 5000,
            revalidateOnFocus: true,
        }
    );

    return {
        price: price || 0,
        loading: isLoading && shouldFetch,
        error: error ? (error.response?.data?.message || "Failed to get price.") : null,
        refetchPrice: mutate
    };
}