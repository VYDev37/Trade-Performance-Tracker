"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAssets } from "@/hooks/asset";
import {
    LogEntry, OrderBook, TickerList, HeaderSummary,
    TechnicalChart, FundamentalsGrid, FinancialTables
} from "@/components/terminal";
import { useParams, useRouter } from "next/navigation";
import { Searchbar } from "@/components/shared";
import { AssetOverview } from "@/schemas/asset.schema";

export default function CompositeClient({ initialId }: { initialId?: string[] }) {
    const params = useParams();
    const router = useRouter();
    const ticker = initialId || params.id;
    const {
        items, itemsLoading,
        selectedTicker, setSelectedTicker,
        detailData, detailLoading,
        chartData, chartLoading,
        timeframe, setTimeframe
    } = useAssets(ticker ? ticker[0] : "");

    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = useMemo(() => {
        if (!items) return [];
        if (!searchQuery.trim()) return items;

        const q = searchQuery.toUpperCase();
        return items.filter(item =>
            item.ticker.toUpperCase().includes(q) ||
            item.name.toUpperCase().includes(q)
        );
    }, [items, searchQuery]);

    useEffect(() => {
        if (!ticker) {
            router.replace('/admin/composite/BBCA');
        }
    }, [ticker, router]);

    useEffect(() => {
        if (!selectedTicker && items && items.length > 0) {
            setSelectedTicker(items[0].ticker);
        }
    }, [items, selectedTicker, setSelectedTicker]);

    const handleSearch = useCallback((finalQuery: string) => {
        setSearchQuery(finalQuery);
    }, []);

    const handleSelectTicker = useCallback((symbol: string) => {
        setSelectedTicker(symbol);
        router.push(`/admin/composite/${symbol}`);
    }, [setSelectedTicker, router]);

    return (
        <div className="flex flex-col h-full py-4 md:py-6 font-mono relative">

            {/* Mobile Header / Drawer Trigger */}
            <div className="lg:hidden flex items-center justify-between px-4 pb-4 shrink-0">
                <span className="font-bold text-lg text-white">IDX Terminal</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] max-w-sm bg-[#0a0a0a] border-r border-white/10 p-0 flex flex-col font-mono">
                        <SheetHeader className="p-4 border-b border-white/10 text-left">
                            <SheetTitle className="text-xs font-bold text-zinc-400 tracking-wider">IDX_ACTIVE_LIST</SheetTitle>
                        </SheetHeader>
                        <Searchbar onSearch={handleSearch} label="Search ticker..." />
                        <TickerList
                            items={filteredItems}
                            itemsLoading={itemsLoading}
                            selectedTicker={selectedTicker || ""}
                            onSelect={handleSelectTicker}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Container */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4 md:gap-6 px-4 lg:px-0">
                {/* Column 1: Desktop Ticker List */}
                <div className="hidden lg:flex w-80 flex-col border border-white/10 bg-zinc-900/50 rounded-lg overflow-hidden shrink-0 shadow-xl">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-xs font-bold text-zinc-400 tracking-wider mb-2">IDX_ACTIVE_LIST</h3>
                        <div className="flex gap-2">
                            <span className="bg-zinc-800 px-2 py-1 text-[10px] font-bold border border-white/10 rounded">ALL_MARKET</span>
                        </div>
                    </div>
                    <Searchbar
                        label="Search ticker..."
                        onSearch={handleSearch}
                    />
                    <TickerList
                        items={filteredItems}
                        itemsLoading={itemsLoading}
                        selectedTicker={selectedTicker || ""}
                        onSelect={handleSelectTicker}
                    />
                </div>

                {/* Main Content Area (Right Side) */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-24 lg:pb-6 pr-1 lg:pr-2">

                    <HeaderSummary
                        high24h={chartData?.daily_high || detailData?.price || 0}
                        detailData={detailData || null}
                        detailLoading={detailLoading}
                        selectedTicker={selectedTicker || ""}
                    />

                    <TechnicalChart
                        chartData={chartData || null}
                        chartLoading={chartLoading}
                        detailData={detailData || null}
                        timeframe={timeframe}
                        setTimeframe={setTimeframe}
                    />

                    <FundamentalsGrid detailData={detailData || null} />

                    {/* Data Visualizers & Order Book */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 shrink-0">
                        <FinancialTables detailData={detailData || null} />
                        <OrderBook loading={detailLoading} ticker={selectedTicker || undefined} currentPrice={detailData?.price} />
                    </div>

                    {/* Terminal Log Area (Desktop Only) */}
                    <div className="hidden md:block shrink-0">
                        <LogEntry loading={detailLoading} ticker={selectedTicker || undefined} />
                    </div>
                </div>
            </div>

            {/* Terminal Log Footer (Mobile Only) */}
            <footer className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 px-4 py-3 flex items-center gap-2 font-mono text-[10px] text-zinc-400 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <span className="text-emerald-500 text-[8px] animate-pulse">●</span>
                <span className="tracking-widest font-bold">IDX_FEED: {detailLoading ? "LOADING..." : "CONNECTED [14ms]"}</span>
                <span className="ml-auto font-bold text-zinc-600">SYS_OK</span>
            </footer>
        </div>
    );
}
