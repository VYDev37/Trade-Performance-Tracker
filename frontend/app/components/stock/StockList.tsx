"use client"

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

import { StockMobileCard, StockDesktopTable } from "@/app/components/stock";

export default function StockList() {
    const router = useRouter();

    const { user, isLoading } = useUser();
    const stocks = (user?.positions || []).sort((a, b) => a.ticker.localeCompare(b.ticker));

    const handleTickerChange = (ticker: string) => {
        router.push(`/admin/stocks?symbol=${ticker}`);
    };

    const handleAddRedirect = (action: string = "add", ticker: string = "") => {
        router.push(`?action=${action}&ticker=${ticker}`, { scroll: false });
    }

    return (
        <>
            {/* Mobile */}
            <StockMobileCard stocks={stocks} loading={isLoading} handleAddRedirect={handleAddRedirect} handleTickerChange={handleTickerChange} />

            {/* Desktop */}
            <StockDesktopTable stocks={stocks} loading={isLoading} handleAddRedirect={handleAddRedirect} handleTickerChange={handleTickerChange} />
        </>
    )
}