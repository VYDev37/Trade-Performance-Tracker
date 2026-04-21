
"use client";

import { useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/app/context/UserContext";
import { useTransaction } from "@/app/context/TransactionContext";

import { Formatter } from "@/app/lib";

interface UserStatValueProps {
    field: "balance" | "total_equity" | "positions_count" |
    "top_gain" | "top_loss" | "loss_amount" |
    "gain_amount" | "loss_gain_sum" | "winning_positions" |
    "losing_positions" | "temp_win_rate";
    subfield?: "stock_balance" | "cash_balance";
    isCurrency?: boolean;
    useDynamicColor?: boolean;
}

// TODO: Change unrealized PNL with realized PNL (from transactions)
export default function UserStatValue({ field, subfield, isCurrency, useDynamicColor }: UserStatValueProps) {
    const { user, isLoading } = useUser();
    const { transactions, loading } = useTransaction();

    const stats = useMemo(() => {
        const transaction = transactions.filter(pos => pos.transaction_type === "sell");

        const gainPositions = transaction
            .filter(pos => pos.realized_pnl >= 0)
            .toSorted((a, b) => b.realized_pnl - a.realized_pnl);

        const lossPositions = transaction
            .filter(pos => pos.realized_pnl < 0)
            .toSorted((a, b) => a.realized_pnl - b.realized_pnl);

        const totalGain = gainPositions.reduce((acc, curr) => acc + (curr.realized_pnl || 0), 0);
        const totalLoss = lossPositions.reduce((acc, curr) => acc + (curr.realized_pnl || 0), 0);

        return {
            gainPositions,
            lossPositions,
            totalGain,
            totalLoss,
            totalCount: transaction.length
        };
    }, [user?.positions.items]);

    let value: number | string;
    if (isLoading || loading)
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
        case "balance":
            const balanceData = user?.balance;
            value = subfield ? (balanceData?.[subfield] || 0) : (user?.balance.stock_balance || 0);
            break;
        case "total_equity":
            value = user?.positions.total_equity || 0;
            break;
        default:
            value = (user as any)?.[field] || 0;
    }

    let colorClass = "";
    if (useDynamicColor && typeof value === "number")
        colorClass = value >= 0 ? "text-green-500" : "text-red-500";

    const hasSign = typeof value === "number" && !["total_equity", "balance", "positions_count", "winning_positions", "losing_positions", "temp_win_rate"].includes(field);
    const sign = hasSign && (value as number) > 0 ? "+" : "";

    return (isLoading || loading) ? (
        <Skeleton className="h-8 w-1/3 bg-slate-800 mb-6" />
    ) : (
        <span className={`font-bold ${colorClass}`}>
            {sign}
            {typeof value === "string" ? value
                : field === "temp_win_rate" ? `${Formatter.toLocale(value)}%`
                    : isCurrency ? Formatter.toCurrency(value) : Formatter.toLocale(value)}
        </span>
    );
}