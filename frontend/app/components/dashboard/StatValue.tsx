
"use client";

import { useMemo } from "react";
import { useUser } from "@/app/context/UserContext";
import { Formatter } from "@/app/lib";

interface UserStatValueProps {
    field: "balance" | "total_equity" | "positions_count" |
    "top_gain" | "top_loss" | "loss_amount" |
    "gain_amount" | "loss_gain_sum" | "winning_positions" |
    "losing_positions" | "temp_win_rate";
    isCurrency?: boolean;
    useDynamicColor?: boolean;
}

export default function UserStatValue({ field, isCurrency, useDynamicColor }: UserStatValueProps) {
    const { user, isLoading } = useUser();

    const stats = useMemo(() => {
        const positions = user?.positions || [];

        const gainPositions = positions
            .filter(pos => pos.unrealized_pnl >= 0)
            .toSorted((a, b) => b.unrealized_pnl - a.unrealized_pnl);

        const lossPositions = positions
            .filter(pos => pos.unrealized_pnl < 0)
            .toSorted((a, b) => a.unrealized_pnl - b.unrealized_pnl);

        const totalGain = gainPositions.reduce((acc, curr) => acc + (curr.unrealized_pnl || 0), 0);
        const totalLoss = lossPositions.reduce((acc, curr) => acc + (curr.unrealized_pnl || 0), 0);

        return {
            gainPositions,
            lossPositions,
            totalGain,
            totalLoss,
            totalCount: positions.length
        };
    }, [user?.positions]);

    let value: number | string;
    if (isLoading)
        return <span className="animate-pulse bg-white/10 rounded w-16 h-4 inline-block" />;

    switch (field) {
        case "top_gain":
            value = stats.gainPositions[0]?.ticker || "No data available.";
            break;
        case "top_loss":
            value = stats.lossPositions[0]?.ticker || "No data available.";
            break;
        case "gain_amount":
            value = stats.totalGain;
            break;
        case "loss_amount":
            value = stats.totalLoss;
            break;
        case "loss_gain_sum":
            value = stats.totalGain + stats.totalLoss;
            break;
        case "winning_positions":
            value = stats.gainPositions.length;
            break;
        case "losing_positions":
            value = stats.lossPositions.length;
            break;
        case "temp_win_rate":
            value = stats.totalCount > 0 ? (stats.gainPositions.length / stats.totalCount) * 100 : 0;
            break;
        case "positions_count":
            value = stats.totalCount;
            break;
        default:
            value = (user as any)?.[field] || 0;
    }

    let colorClass = "";
    if (useDynamicColor && typeof value === "number")
        colorClass = value >= 0 ? "text-green-500" : "text-red-500";

    const hasSign = typeof value === "number" && !["total_equity", "balance", "positions_count", "winning_positions", "losing_positions", "temp_win_rate"].includes(field);
    const sign = hasSign && (value as number) > 0 ? "+" : "";

    return (
        <span className={`font-bold ${colorClass}`}>
            {sign}
            {typeof value === "string" ? value
                : field === "temp_win_rate" ? `${Formatter.toLocale(value)}%`
                    : isCurrency ? Formatter.toCurrency(value) : Formatter.toLocale(value)}
        </span>
    );
}