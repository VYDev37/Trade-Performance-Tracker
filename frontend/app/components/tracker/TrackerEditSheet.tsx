"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateTransaction } from "@/app/hooks/transaction";
import type { TransactionInfo } from "@/app/types/user/TransactionInfo";
import type { UpdateTransactionReq } from "@/app/types/http/UserRequest";

interface TrackerEditSheetProps {
    onRefresh: () => void;
    existingData: TransactionInfo;
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function TrackerEditSheet({ onRefresh, existingData, isOpen, onOpenChange }: TrackerEditSheetProps) {
    const { updateTransaction, loading } = useUpdateTransaction();

    const [data, setData] = useState<UpdateTransactionReq>({
        title: existingData.title || "",
        notes: existingData.notes || "",
        price: existingData.price?.toString() || "",
        reverse: false
    });

    const handleChangeData = (key: keyof UpdateTransactionReq, value: any) => {
        setData((prev) => ({ ...prev, [key]: typeof value === "function" ? value(prev[key as keyof UpdateTransactionReq]) : value }));
    }

    const handleUpdate = async () => {
        if (!data.title.trim() || loading)
            return;

        const numPrice = parseFloat(data.price);
        if (isNaN(numPrice) || numPrice < 0)
            return;

        try {
            const success = await updateTransaction(existingData.id, data);
            if (success) {
                onOpenChange(false);
                if (onRefresh)
                    onRefresh();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange} modal={false}>
            <SheetContent onInteractOutside={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="bg-zinc-950 text-white border-white/10 sm:max-w-md overflow-y-auto w-full">
                <SheetHeader>
                    <SheetTitle className="text-white">Edit Transaction</SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        Edit details for '{existingData.title}'.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-6 mx-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Title</label>
                        <Input
                            value={data.title}
                            onChange={(e) => handleChangeData("title", e.target.value)}
                            placeholder="Transaction title"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => handleChangeData("price", e.target.value)}
                            placeholder="0.00"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Notes</label>
                        <Textarea
                            value={data.notes}
                            onChange={(e) => handleChangeData("notes", e.target.value)}
                            placeholder="Add notes..."
                            className="bg-black/50 border-white/10 text-white min-h-[120px] whitespace-pre-wrap"
                        />
                    </div>

                    <div className="flex space-y-2 items-center space-x-2">
                        <Input type="checkbox"
                            id="inv2"
                            checked={data.reverse}
                            className="w-4 h-4 mt-[10px] accent-blue-500"
                            onChange={(e) => handleChangeData("reverse", e.target.checked)}
                        />
                        <label htmlFor="inv2" className="text-sm cursor-pointer">
                            Reverse type (Income {"<->"} Expense)
                        </label>
                    </div>

                    <Button onClick={handleUpdate} disabled={loading || !data.title.trim()}
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
