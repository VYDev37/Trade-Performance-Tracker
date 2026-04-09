"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateTransaction } from "@/app/hooks/transaction";
import type { TransactionInfo } from "@/app/types/user/TransactionInfo";
import { Loader2 } from "lucide-react";

interface TrackerEditSheetProps {
    onRefresh: () => void;
    existingData: TransactionInfo;
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function TrackerEditSheet({ onRefresh, existingData, isOpen, onOpenChange }: TrackerEditSheetProps) {
    const { updateTransaction, loading } = useUpdateTransaction();

    const [title, setTitle] = useState(existingData.title || "");
    const [notes, setNotes] = useState(existingData.notes || "");
    const [price, setPrice] = useState(existingData.price?.toString() || "0");

    const handleUpdate = async () => {
        if (!title.trim() || loading) return;

        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) return;

        try {
            const success = await updateTransaction(existingData.id, {
                title,
                notes,
                price: numPrice
            });

            if (success) {
                onOpenChange(false);
                if (onRefresh) onRefresh();
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Transaction title"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="bg-black/50 border-white/10 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Notes</label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes..."
                            className="bg-black/50 border-white/10 text-white min-h-[120px] whitespace-pre-wrap"
                        />
                    </div>

                    <Button
                        onClick={handleUpdate}
                        disabled={loading || !title.trim()}
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
