"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

import { StockMobileCard, StockDesktopTable } from "@/app/components/stock";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StockList() {
    const router = useRouter();

    const { user, isLoading } = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const stocks = useMemo(() => {
        return [...(user?.positions || [])].sort((a, b) => a.ticker.localeCompare(b.ticker));
    }, [user?.positions]);

    const paginatedStocks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return stocks.slice(startIndex, startIndex + itemsPerPage);
    }, [stocks, currentPage]);

    const totalPages = Math.ceil(stocks.length / itemsPerPage);

    const renderPaginationDots = () => {
        let pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push('...');
            }
        }
        pages = pages.filter((item, index) => item !== '...' || pages[index - 1] !== '...');

        return pages.map((page, index) => {
            if (page === '...') {
                return <span key={`ellipsis-${index}`} className="px-2 text-slate-500">...</span>;
            }
            return (
                <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 p-0 ${currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300"}`}
                >
                    {page}
                </Button>
            );
        });
    };

    const handleTickerChange = (ticker: string) => {
        router.push(`/admin/stocks?symbol=${ticker}`);
    };

    const handleAddRedirect = (action: string = "add", ticker: string = "") => {
        router.push(`?action=${action}&ticker=${ticker}`, { scroll: false });
    }

    return (
        <div className="space-y-4">
            {/* Mobile */}
            <StockMobileCard stocks={paginatedStocks} loading={isLoading} handleAddRedirect={handleAddRedirect} handleTickerChange={handleTickerChange} />

            {/* Desktop */}
            <StockDesktopTable stocks={paginatedStocks} loading={isLoading} handleAddRedirect={handleAddRedirect} handleTickerChange={handleTickerChange} />

            {stocks.length > 0 && !isLoading && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4">
                    <div className="text-sm text-slate-400">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stocks.length)} of {stocks.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 h-8"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                        <div className="flex items-center gap-1">
                            {renderPaginationDots()}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 h-8"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}