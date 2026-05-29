"use client"

import { useState } from "react";
import useSWR from "swr";
import { axios } from "@/app/lib";
import { AssetInfo, AssetOverview, AssetChartResponse } from "@/app/schemas/asset.schema";

const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function useAssets(initialTicker?: string) {
    const [selectedTicker, setSelectedTicker] = useState<string | null>(initialTicker || null);

    const { data: items, error: itemsError, isLoading: itemsLoading } = useSWR<AssetOverview[]>(
        "/asset/get-items",
        fetcher,
        { refreshInterval: 15000, revalidateOnFocus: true }
    );

    const [timeframe, setTimeframe] = useState<string>("1M");

    const { data: detailData, error: detailError, isLoading: detailLoading } = useSWR<AssetInfo | null>(
        selectedTicker ? `/asset/get-item/${selectedTicker}` : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    const { data: chartData, error: chartError, isLoading: chartLoading } = useSWR<AssetChartResponse | null>(
        selectedTicker ? `/asset/get-chart/${selectedTicker}?timeframe=${timeframe}` : null,
        fetcher,
        { refreshInterval: 10000, revalidateOnFocus: true }
    );

    return {
        items: items || [],
        itemsLoading,
        itemsError,

        selectedTicker,
        setSelectedTicker,

        detailData,
        detailLoading,
        detailError,

        chartData,
        chartLoading,
        chartError,

        timeframe,
        setTimeframe
    };
}
