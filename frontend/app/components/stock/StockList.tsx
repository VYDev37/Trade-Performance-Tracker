"use client"

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Formatter } from "@/app/lib";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useUser } from "@/app/context/UserContext";

export default function StockList() {
    const router = useRouter();

    const { user } = useUser();
    const stocks = user?.positions || [];

    const handleTickerChange = (ticker: string) => {
        router.push(`/admin/stocks?symbol=${ticker}`);
    };

    const handleAddRedirect = (action: string = "add", ticker: string = "") => {
        router.push(`?action=${action}&ticker=${ticker}`, { scroll: false });
    }

    return (
        <>
            {/* Mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {stocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 border-2 border-dashed border-white/5 rounded-2xl bg-zinc-900/20 text-center">
                        <div className="h-16 w-16 bg-sky-500/10 rounded-full flex items-center justify-center mb-4">
                            <i className="fa-solid fa-chart-line text-sky-500 text-2xl opacity-50"></i>
                        </div>

                        <h3 className="text-lg font-semibold text-white">Your portfolio is empty</h3>
                        <p className="text-sm text-zinc-500 mt-1 mb-6 max-w-[200px]">
                            Ready to start your investment journey? Add your first stock now.
                        </p>

                        <Button variant="gradient" onClick={() => handleAddRedirect()}>
                            + Start Investing
                        </Button>
                    </div>
                ) : stocks.map((stock, idx) => {
                    const currentPrice = stock.current_price;
                    const isProfit = stock.pnl_percentage > 0;
                    const pnlSign = isProfit ? "+" : "";

                    return (
                        <Card key={idx} className="bg-zinc-900/50 border-white/10 p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider">Ticker</div>
                                    <div className="text-lg font-bold text-sky-400" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleTickerChange(stock.ticker)}
                                        onClick={() => handleTickerChange(stock.ticker)}>{stock.ticker}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider">Market Value</div>
                                    <div className={cn("text-sm font-bold", isProfit ? "text-emerald-400" : "text-red-400")}>
                                        {stock.pnl_percentage === 0 ? "" : isProfit ? "▲" : "▼"} {Formatter.toLocale(currentPrice / stock.total_qty)} ({pnlSign}{Formatter.toLocale(stock.pnl_percentage)}%)
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5">
                                <div>
                                    <div className="text-[10px] text-zinc-500 uppercase">Invested Total</div>
                                    <div className="text-sm font-medium">{Formatter.toCurrency(stock.invested_total)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-zinc-500 uppercase">Total Qty</div>
                                    <div className="text-sm font-medium">{Formatter.toLocale(stock.total_qty / 100)} Lot</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5">
                                <div>
                                    <div className="text-[10px] text-zinc-500 uppercase">Current Price</div>
                                    <div className="text-sm font-medium">{Formatter.toCurrency(currentPrice)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">PnL Unrealized</div>
                                    <div className={cn("text-sm font-bold", isProfit ? "text-emerald-400" : "text-red-400")}>
                                        {isProfit ? "▲" : "▼"} {Formatter.toLocale(stock.unrealized_pnl)} ({pnlSign}{Formatter.toLocale(stock.pnl_percentage)}%)
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button className="flex-1 bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600 hover:text-white transition-all"
                                    onClick={() => handleAddRedirect("add", stock.ticker)}>Buy</Button>
                                <Button className="flex-1 bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"
                                    onClick={() => handleAddRedirect("sell", stock.ticker)}>Sell</Button>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <Table className="mt-5">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Ticker</TableHead>
                            <TableHead>Total Qty (Lot)</TableHead>
                            <TableHead>Invested Total (Rp)</TableHead>
                            <TableHead>Current Value</TableHead>
                            <TableHead>PnL Unrealized</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stocks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-zinc-500 italic">
                                    <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer" role="button" tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddRedirect()} onClick={() => handleAddRedirect()}>
                                        <i className="fa-solid fa-folder-open text-2xl opacity-20"></i>
                                        <p>No stocks found. Start by adding your first position!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : stocks.map((stock, idx) => {
                            const currentPrice = stock.current_price;
                            const isProfit = stock.pnl_percentage > 0;
                            const pnlSign = isProfit ? "+" : "";

                            return (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium cursor-pointer" role="button" tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTickerChange(stock.ticker)} onClick={() => handleTickerChange(stock.ticker)}>{stock.ticker}</TableCell>
                                    <TableCell>{Formatter.toLocale(stock.total_qty / 100)}</TableCell>
                                    <TableCell>{Formatter.toCurrency(stock.invested_total)}</TableCell>
                                    <TableCell>{Formatter.toCurrency(currentPrice)}</TableCell>
                                    <TableCell className={isProfit ? "text-emerald-400" : "text-red-400"}>
                                        {pnlSign}{Formatter.toLocale(stock.unrealized_pnl)} ({pnlSign}{Formatter.toLocale(stock.pnl_percentage)}%)
                                    </TableCell>
                                    <TableCell>{Formatter.toDate(stock.updated_at)}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button className="bg-green-600 text-white" onClick={() => handleAddRedirect("add", stock.ticker)}>Buy</Button>
                                        <Button className="bg-red-600 text-white" onClick={() => handleAddRedirect("sell", stock.ticker)}>Sell</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}