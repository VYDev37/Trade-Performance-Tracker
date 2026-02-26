import type { TransactionInfo } from "@/app/types/user/TransactionInfo";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Formatter } from "@/app/lib";

import { ArrowUpDown, Info } from "lucide-react";

interface TranTableProps {
    transactions: TransactionInfo[];
    loading: boolean;
    toggleSort: () => void;
}

export default function TransactionTable({ transactions, loading, toggleSort }: TranTableProps) {
    return (
        <Card className="hidden md:block border-slate-800 bg-slate-950/50 backdrop-blur-sm shadow-xl">
            <CardContent className="p-0">
                <div className="rounded-md border border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-900">
                            <TableRow className="hover:bg-slate-900/50 border-slate-800">
                                <TableHead className="w-[180px] cursor-pointer hover:text-white transition-colors" onClick={toggleSort}>
                                    <div className="flex items-center gap-2">
                                        Date
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Ticker</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Quantity (Lot)</TableHead>
                                <TableHead className="text-right">Price per unit</TableHead>
                                <TableHead className="text-right">Base Price</TableHead>
                                <TableHead className="text-right">Fee</TableHead>
                                <TableHead className="text-right">Total Value</TableHead>
                                <TableHead className="text-right">Realized PnL</TableHead>
                                <TableHead className="text-right">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading Skeletons
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-slate-800">
                                        <TableCell><Skeleton className="h-4 w-32 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-12 bg-slate-800" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 bg-slate-800 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20 bg-slate-800 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24 bg-slate-800 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 bg-slate-800 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : transactions.length > 0 ? (
                                transactions.map((transaction) => {
                                    const sign = transaction.realized_pnl > 0 ? "+" : "-";
                                    const color = transaction.realized_pnl === 0 ? "" : sign === "+" ? "text-emerald-500" : "text-red-500";
                                    const rPnlPercentage = (transaction.realized_pnl / transaction.base_price) * 100;

                                    const isCashflow = transaction.transaction_type === "cashflow";
                                    return (
                                        <TableRow key={transaction.id} className="border-slate-800 hover:bg-slate-900/30 transition-colors">
                                            <TableCell className="font-medium text-slate-300">
                                                {Formatter.toDate(transaction.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold text-white bg-slate-800 px-2 py-1 rounded text-xs tracking-wide">
                                                    {transaction.ticker}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${transaction.transaction_type.toLowerCase() === 'buy'
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    }`}
                                                >
                                                    {transaction.transaction_type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-slate-300">
                                                {Formatter.toLocale(transaction.quantity / 100)}
                                            </TableCell>
                                            <TableCell className="text-right text-slate-300">
                                                {Formatter.toCurrency(transaction.price_per_unit)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-white">
                                                {Formatter.toCurrency(transaction.base_price)}
                                            </TableCell>
                                            <TableCell className="text-right text-slate-400 text-xs">
                                                {Formatter.toCurrency(transaction.transaction_fee)}
                                            </TableCell>
                                            <TableCell className="text-right text-slate-400 text-xs">
                                                {Formatter.toCurrency(transaction.price)}
                                            </TableCell>
                                            <TableCell className={`text-right text-slate-400 text-xs ${color}`}>
                                                {transaction.realized_pnl === 0 ? "-" :
                                                    `${sign}${Formatter.toCurrency(Math.abs(transaction.realized_pnl))} 
                                                                (${sign}${Formatter.toLocale(Math.abs(rPnlPercentage))}%)`}
                                            </TableCell>
                                            <TableCell className="text-center text-slate-400 text-xs">
                                                {isCashflow ? (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost">
                                                                <Info className="h-2 w-2" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md bg-zinc-950 text-white border-white/10">
                                                            <DialogHeader>
                                                                <DialogTitle>Transaction Notes</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="text-slate-300 text-sm mt-4 break-words">
                                                                {transaction.notes || "No notes available for this transaction."}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                ) : "-"}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-32 text-center text-slate-400">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}