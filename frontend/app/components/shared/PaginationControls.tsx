import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    totalEntries,
    itemsPerPage,
    onPageChange,
}: PaginationControlsProps) {
    if (totalEntries === 0) return null;

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
                return <span key={`ellipsis-${index}`} className="px-2 text-slate-500 select-none">...</span>;
            }
            return (
                <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={`w-8 h-8 p-0 text-xs font-bold ${currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300"}`}
                >
                    {page}
                </Button>
            );
        });
    };

    const startIndex = ((currentPage - 1) * itemsPerPage) + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalEntries);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-sm text-slate-400">
                Showing {startIndex} to {endIndex} of {totalEntries} entries
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 h-8"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
