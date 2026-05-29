"use client"

import { useState, useEffect } from "react";
import { CircleAlert, Plus } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useUser } from "@/app/stores";
import { useTransaction } from "@/app/stores";
import { useAddPosition, useGetCurrentPrice } from "@/app/hooks";

import { QuantitySlider } from "@/app/components/stock";
import CheckboxMarketPrice from "./CheckboxMarketPrice";
import CustomPriceInput from "./CustomPriceInput";
import type { PortfolioAddReq } from "@/app/schemas/balance.schema";
import { Formatter } from "@/app/lib";
import AddAccountModal from "../profile/AddAccountModal";

interface AccountProp {
    provider_name: string;
    account_no: string;
    is_new: boolean;
}

export default function StockAddPosition() {
    const [opened, setOpened] = useState<boolean>(false);
    const [useCurrent, setUseCurrent] = useState<boolean>(false);

    const [pricePerShare, setPricePerShare] = useState<number>(0);
    const [feePercentage, setFeePercentage] = useState<number>(0);

    const [formData, setFormData] = useState<PortfolioAddReq>({ ticker: "", qty: 0, inv: 0, fee: 0, provider: "", account_no: "" });

    const { addPosition, loading: isSubmitting, error: submissionError } = useAddPosition();
    const { price: currentPrice, loading: isLoadingPrice, error: fetchPriceError } = useGetCurrentPrice(formData.ticker);

    const user = useUser((state) => state.user);
    const refetch = useTransaction((state) => state.refetch);
    const fetchAccounts = useTransaction((state) => state.fetchAccounts);
    const availableAccounts = useTransaction((state) => state.availableAccounts);

    const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);
    const [localNewAccounts, setLocalNewAccounts] = useState<AccountProp[]>([]);

    const accountsToDisplay = [
        ...(availableAccounts || []).map(acc => ({
            provider_name: acc.provider_name,
            account_no: acc.account_no,
            is_new: false
        })),
        ...localNewAccounts
    ];

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isExecuted = !!searchParams.get("ticker");
    const action = searchParams.get("action"), ticker = searchParams.get("ticker");
    const isSellMode = action === "sell";

    const currentStock = user?.positions?.items?.find(p => p.ticker === ticker);
    const selectedAccountObj = availableAccounts?.find(
        (acc) => acc.provider_name === formData.provider && acc.account_no === formData.account_no
    );
    const activeBalance = selectedAccountObj !== undefined ? (selectedAccountObj.amount ?? 0) : (user?.balance.stock_balance ?? 0);
    const pricePerLot = (pricePerShare || currentPrice || 0) * 100;
    const maxLot = isSellMode
        ? ((currentStock?.total_qty || 0) / 100)
        : (pricePerLot > 0 ? Math.floor(activeBalance / pricePerLot) : 0);

    const onKillSheet = () => {
        setOpened(false);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("action");
        params.delete("ticker");

        const queryString = params.toString();
        const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;

        router.replace(updatedPath, { scroll: false });
    };

    const handleFormChange = (field: string, value: string | number) => {
        let val: string | number = value;

        if (["qty", "inv", "fee"].includes(field) && typeof value === "string") {
            const numVal = value.replace(/[^0-9]/g, "");
            val = numVal;

            if (isSellMode && field === "qty" && Number(numVal) > maxLot) {
                val = String(maxLot);
            }
        }

        if (field === "inv")
            setUseCurrent(false);
        if (field === "fee")
            setFeePercentage(0);

        setFormData({ ...formData, [field]: val });
    }

    const handleSubmit = async () => {
        const success = await addPosition(isSellMode ? "sell" : "buy", formData, "stocks");
        if (success) {
            onKillSheet();
            setFormData({ ticker: "", qty: 0, inv: 0, fee: 0, provider: "", account_no: "" });
            await refetch(true);
        }
    }

    const onAddAccount = (selectedProvider: string, accountNo: string) => {
        const newAccount: AccountProp = { provider_name: selectedProvider, account_no: accountNo, is_new: true };
        setLocalNewAccounts(prev => [...prev, newAccount]);
        setFormData(prev => ({
            ...prev,
            provider: selectedProvider,
            account_no: accountNo
        }));
        setShowAddAccountModal(false);
    }

    useEffect(() => {
        if (opened) {
            fetchAccounts("stock_balance");
        }
    }, [opened, fetchAccounts]);

    useEffect(() => {
        const userHasStock = (user?.positions.items || []).some(x => x.ticker === ticker);
        if (isSellMode && !userHasStock) {
            onKillSheet();
        }
    }, [isSellMode, user?.positions.items, ticker]);

    useEffect(() => {
        if (action === "add" || isSellMode) {
            setOpened(true);
            if (ticker)
                handleFormChange("ticker", ticker);
        }
    }, [searchParams]);

    useEffect(() => {
        if (useCurrent && currentPrice > 0) {
            setPricePerShare(currentPrice);
        }
    }, [useCurrent, currentPrice]);

    useEffect(() => {
        const qty = Number(formData.qty) || 0;
        const price = Number(pricePerShare) || 0;
        const totalInv = price * qty * 100;

        setFormData(prev => {
            let fee = prev.fee;
            if (feePercentage > 0) {
                fee = (feePercentage / 100) * totalInv;
            }
            if (prev.inv === totalInv && prev.fee === fee)
                return prev;

            return {
                ...prev,
                inv: Math.round(totalInv),
                fee: Math.round(fee)
            }
        });
    }, [formData.qty, pricePerShare, feePercentage]);

    useEffect(() => {
        if (currentPrice > 0 && pricePerShare === 0) {
            setPricePerShare(currentPrice);
            setUseCurrent(true);
        }
    }, [currentPrice]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpened(isOpen);

        if (!isOpen) {
            onKillSheet();
        } else {
            setOpened(true);
        }
    };

    return (
        <Sheet open={opened} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button variant="gradient">+ Add Stock</Button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-950 text-white border-white/10 sm:max-w-md overflow-y-auto">
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

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Select Broker Account
                            </Label>
                            <button
                                type="button"
                                onClick={() => setShowAddAccountModal(true)}
                                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add New
                            </button>
                        </div>
                        <div className="relative mt-1">
                            <Select
                                value={formData.provider && formData.account_no ? `${formData.provider}-${formData.account_no}` : ""}
                                onValueChange={(val) => {
                                    const [provider, account_no] = val.split("-");
                                    setFormData({
                                        ...formData,
                                        provider,
                                        account_no
                                    });
                                }}
                            >
                                <SelectTrigger className="w-full bg-slate-900 border-white/10 text-xs font-bold text-white h-12 rounded-md focus:ring-1 focus:ring-blue-500">
                                    <SelectValue placeholder="Select Broker Account" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 text-white border-white/10">
                                    <SelectGroup>
                                        {accountsToDisplay.map((acc, index) => {
                                            const val = `${acc.provider_name}-${acc.account_no}`;
                                            return (
                                                <SelectItem key={val + index} value={val} className="text-xs font-semibold">
                                                    {acc.provider_name} - {acc.account_no}
                                                </SelectItem>
                                            );
                                        })}
                                        {accountsToDisplay.length === 0 && (
                                            <div className="p-4 text-xs text-slate-500 text-center font-bold">
                                                No existing accounts. Please click 'Add New'.
                                            </div>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.provider && formData.account_no && (
                            <div className="flex justify-between items-center text-[11px] lg:text-xs font-semibold text-slate-400 mt-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                <span>Available Balance:</span>
                                <span className="text-emerald-400 font-bold">{Formatter.formatCurrency(activeBalance)}</span>
                            </div>
                        )}
                    </div>

                    {/* Inline Overlay Sub-Modal for adding new accounts */}
                    {showAddAccountModal && (
                        <AddAccountModal
                            onClose={() => setShowAddAccountModal(false)}
                            onAdd={onAddAccount}
                        />
                    )}

                    {isSellMode && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-400 italic">
                                Note: Selling will reduce your current lot size.
                            </p>
                        </div>
                    )}
                    <div className="space-y-3">
                        <div className="space-y-3">
                            <Label htmlFor="qty">Quantity (Lot)</Label>
                            <Input id="qty" type="text" inputMode="numeric" value={formData.qty}
                                onChange={(e) => handleFormChange("qty", e.target.value)} />
                        </div>
                        <QuantitySlider
                            max={maxLot}
                            current={formData.qty}
                            onChange={(val) => handleFormChange("qty", val)}
                        />

                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="inv">{isSellMode ? "Sold for" : "Invested Total"} (Rp)</Label>
                        <Input id="inv" type="text" inputMode="numeric" value={formData.inv} disabled={useCurrent}
                            onChange={(e) => handleFormChange("inv", e.target.value)} />

                        <div className="space-y-4 mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                            {/* Checkbox Market Price */}
                            <CheckboxMarketPrice
                                checked={useCurrent}
                                isLoading={isLoadingPrice}
                                currentPrice={currentPrice}
                                onChange={(nextVal) => {
                                    setUseCurrent(nextVal);
                                    if (nextVal) {
                                        handleFormChange("inv", currentPrice * formData.qty * 100);
                                    }
                                }}
                            />

                            {/* Separator 'OR' */}
                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="flex-shrink mx-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">OR</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>

                            {/* Custom Price Input */}
                            <CustomPriceInput
                                disabled={useCurrent}
                                currentPrice={currentPrice}
                                onChange={(val) => {
                                    setPricePerShare(val);
                                    setUseCurrent(false);
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="inv">Transaction Fee (Rp)</Label>
                        <Input id="inv" type="text" inputMode="numeric" value={formData.fee}
                            onChange={(e) => handleFormChange("fee", e.target.value)} />
                    </div>

                    {/* Separator 'OR' */}
                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-gray-700"></div>
                        <span className="flex-shrink mx-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">OR</span>
                        <div className="flex-grow border-t border-gray-700"></div>
                    </div>

                    {/* Custom Fee percentage input */}
                    <div className="space-y-2">
                        <Label htmlFor="custom-price" className="text-xs text-gray-400">
                            Input fee percentage
                        </Label>
                        <div className="relative">
                            <Input id="custom-price" type="text" inputMode="numeric" className="pr-9 bg-gray-950 border-gray-700 transition-opacity opacity-100"
                                onChange={(e) => {
                                    const feePercentage = Number(e.target.value);
                                    setFeePercentage(feePercentage);
                                }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                    </div>

                    <Button className="mt-3" onClick={handleSubmit} disabled={isSubmitting || isLoadingPrice}>
                        {isSubmitting ? "Processing..." : isSellMode ? "Sell Stock" : "Add Position"}
                    </Button>

                    {fetchPriceError && (
                        <div className="flex items-center rounded-lg bg-destructive/10 p-3 mb-2 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                            <CircleAlert className="h-4 w-4 mr-2" />
                            {fetchPriceError}
                        </div>
                    )}

                    {submissionError && (
                        <div className="flex items-center rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                            <CircleAlert className="h-4 w-4 mr-2" /> {submissionError}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}