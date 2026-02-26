"use client"

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useUser } from "@/app/context/UserContext";
import { useAddPosition, useGetCurrentPrice } from "@/app/hooks";
import type { PortfolioAddReq } from "@/app/types/user/PortfolioInfo";

export default function StockAddPosition() {
    const [opened, setOpened] = useState<boolean>(false);
    const [useCurrent, setUseCurrent] = useState<boolean>(false);

    const [formData, setFormData] = useState<PortfolioAddReq>({ ticker: "", qty: 0, inv: 0, fee: 0 });

    const { addPosition, loading: isSubmitting, error: submissionError } = useAddPosition();
    const { price: currentPrice, loading: isLoadingPrice, error: fetchPriceError } = useGetCurrentPrice(formData.ticker);

    const { user } = useUser();

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isExecuted = !!searchParams.get("ticker");
    const action = searchParams.get("action"), ticker = searchParams.get("ticker");
    const isSellMode = action === "sell";

    const currentStock = user?.positions?.find(p => p.ticker === ticker);
    const maxLot = currentStock?.total_qty || 0;

    const handleFormChange = (field: string, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    }

    const handleSubmit = async () => {
        const success = await addPosition(isSellMode ? "sell" : "buy", formData, "stocks");
        if (success) {
            setOpened(false);
            setFormData({ ticker: "", qty: 0, inv: 0, fee: 0 });
        }
    }

    useEffect(() => {
        if (action === "add" || isSellMode) {
            setOpened(true);
            if (ticker)
                handleFormChange("ticker", ticker);
        }
    }, [searchParams]);

    useEffect(() => {
        if (useCurrent && currentPrice > 0 && formData.qty > 0) {
            const autoValue = currentPrice * formData.qty * 100;
            handleFormChange("inv", autoValue);
        }
    }, [currentPrice, formData.qty, useCurrent]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpened(isOpen);

        if (!isOpen) {
            const params = new URLSearchParams(searchParams.toString());

            params.delete("action");
            params.delete("ticker");

            const queryString = params.toString();
            const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;

            router.replace(updatedPath, { scroll: false });
        }
    };

    return (
        <Sheet open={opened} onOpenChange={handleOpenChange} >
            <SheetTrigger asChild>
                <Button variant="gradient">+ Add Stock</Button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-950 text-white border-white/10 sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className={isSellMode ? "text-red-500" : "text-green-500"}>
                        {isSellMode ? "Sell Position" : "Add Position / Buy"}
                    </SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        Input your trade details to update your performance tracker.
                    </SheetDescription>
                </SheetHeader>

                {/* Forms */}
                <div className="space-y-4 mt-6 mx-5 w-[75%]">
                    <div className="space-y-3">
                        <Label htmlFor="ticker">Ticker</Label>
                        <Input id="ticker" type="text" value={formData.ticker} readOnly={isExecuted}
                            onChange={(e) => handleFormChange("ticker", e.target.value.toUpperCase())} />
                    </div>
                    {isSellMode && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-400 italic">
                                Note: Selling will reduce your current lot size.
                            </p>
                        </div>
                    )}
                    <div className="space-y-3">
                        <Label htmlFor="qty">Quantity (Lot)</Label>
                        <Input id="qty" type="number" value={formData.qty} min="1" max={isSellMode ? maxLot : undefined}
                            onChange={(e) => handleFormChange("qty", e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="inv">{isSellMode ? "Sold for" : "Invested Total"} (Rp)</Label>
                        <Input id="inv" type="number" value={formData.inv} min="1" disabled={useCurrent}
                            onChange={(e) => handleFormChange("inv", e.target.value)} />
                        <div className="flex flex-row items-center gap-2 mt-2">
                            <Input id="inv2" type="checkbox" checked={useCurrent} className="w-4 h-4"
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setUseCurrent(checked);
                                    if (checked) {
                                        handleFormChange("inv", currentPrice * formData.qty * 100);
                                    }
                                }} />
                            <Label htmlFor="inv2">
                                Use current market price
                                {isLoadingPrice ? " (loading...)" : currentPrice > 0 ? ` (Rp ${currentPrice.toLocaleString("id-ID")}/share)` : ""}
                            </Label>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="inv">Transaction Fee (Rp)</Label>
                        <Input id="inv" type="number" value={formData.fee} min="1"
                            onChange={(e) => handleFormChange("fee", e.target.value)} />
                    </div>

                    <Button className="mt-3" onClick={handleSubmit} disabled={isSubmitting || isLoadingPrice}>
                        {isSubmitting ? "Processing..." : isSellMode ? "Sell Stock" : "Add Position"}
                    </Button>

                    {fetchPriceError && (
                        <div className="rounded-lg bg-destructive/10 p-3 mb-2 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                            <i className="fa-solid fa-circle-exclamation mr-2"></i>
                            {fetchPriceError}
                        </div>
                    )}

                    {submissionError && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                            <i className="fa-solid fa-circle-exclamation mr-2"></i>
                            {submissionError}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}