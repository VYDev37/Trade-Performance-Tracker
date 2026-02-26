import { MoreHorizontal } from "lucide-react";

import { StockAddPosition, StockChart, StockList } from "@/app/components/stock";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

interface StockParams {
    searchParams: Promise<{ symbol?: string }>
}

export default async function Stocks({ searchParams }: StockParams) {
    const params = await searchParams;
    const ticker = params.symbol || "COMPOSITE";

    return (
        <div className="flex flex-col w-[90%] md:w-[95%] pt-3 pb-6 space-y-6">
            <h1 className="text-2xl font-bold">Current market</h1>

            <Card className="p-0 overflow-hidden border-white/5 aspect-video md:aspect-auto h-[300px] md:h-[450px]">
                <StockChart symbol={ticker} />
            </Card>

            <div className="my-6 md:my-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-bold">My stocks</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none">
                                <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white">
                                <DropdownMenuLabel>My portfolio</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="cursor-pointer hover:bg-sky-500">Stocks (IDX only)</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-green-600">Crypto (Spot / Live)</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:bg-green-600">Crypto (Futures / Perp)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <StockAddPosition />
                </div>
                <StockList />
            </div>
        </div>
    );
}