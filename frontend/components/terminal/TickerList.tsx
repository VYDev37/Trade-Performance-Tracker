import React from "react";
import TickerItem from "./TickerItem";
import { AssetOverview } from "@/schemas/asset.schema";

const MemoizedTickerItem = React.memo(TickerItem);

interface TickerListProps {
    items: AssetOverview[] | null;
    itemsLoading: boolean;
    selectedTicker: string;
    onSelect: (ticker: string) => void;
}

export default function TickerList({ items, itemsLoading, selectedTicker, onSelect }: TickerListProps) {
    if (itemsLoading) {
        return (
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <div className="p-4 text-xs text-zinc-500 animate-pulse">LOADING_TICKERS...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {items && items.map((item: AssetOverview, idx: number) => {
                const symbol = item.ticker;
                const positive = item.change >= 0;
                return (
                    <MemoizedTickerItem
                        company_name={item.name}
                        key={symbol + idx}
                        ticker={item.ticker}
                        price={item.price}
                        change={item.change}
                        isPositive={positive}
                        active={selectedTicker === symbol}
                        onClick={() => onSelect(symbol)}
                    />
                );
            })}
        </div>
    );
}
