"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react"; // Ikon tambahan

import { useUpdateBalance } from "@/app/hooks";
import type { UserBalanceReq } from "@/app/types/http/UserRequest";

interface ManageBalanceSheetProps {
    children?: React.ReactNode;
}

export default function ManageBalanceSheet({ children }: ManageBalanceSheetProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<UserBalanceReq>({ amount: 0, mode: "add", note: "", fee: 0, bank_src: "" });

    const { updateBalance, loading, error } = useUpdateBalance();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await updateBalance(formData);
        if (success) {
            setOpen(false);
        }
    }

    const handleFormChange = (field: "amount" | "mode" | "note" | "fee" | "bank_src", value: string | number) => {
        setFormData({ ...formData, [field]: value });
    }

    const renderForm = (modeLabel: string, colorClass: string) => (
        <form onSubmit={handleSubmit} className="space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ">
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount to {modeLabel.toLowerCase()}
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                    <Input id="amount" type="number" placeholder="0.00" value={formData.amount} min={0} max={formData.mode === "rem" ? formData.amount : undefined}
                        onChange={(e) => handleFormChange("amount", +e.target.value)} className="pl-10 bg-transparent border-none text-2xl h-14 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold"
                        required />
                </div>
                <Label htmlFor="bank_src" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Source (e.g. SeaBank)
                </Label>
                <div className="relative">
                    <Input id="bank_src" type="text" placeholder="Bank / E-Wallet Name" value={formData.bank_src} onChange={(e) => handleFormChange("bank_src", e.target.value)}
                        className="bg-transparent border-none text-xs h-14 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold"
                        required />
                </div>
                {modeLabel.toLowerCase() !== "adjust" && (
                    <>
                        <Label htmlFor="fee" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Transaction Fee
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                            <Input id="fee" type="number" placeholder="0.00" value={formData.fee} min={0}
                                onChange={(e) => handleFormChange("fee", +e.target.value)} className="pl-10 bg-transparent border-none text-2xl h-14 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold"
                                required />
                        </div>
                    </>
                )}
                <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Transaction Note (Optional)
                </Label>
                <div className="relative">
                    <Input id="notes" type="text" placeholder="Your notes here..." value={formData.note} onChange={(e) => handleFormChange("note", e.target.value)}
                        className="bg-transparent border-none text-md h-14 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold" />
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                    {error}
                </div>
            )}

            <Button type="submit" className={`w-50 p-4 text-white text-md font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${colorClass}`}
                disabled={loading}>
                {loading ? (
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    `${modeLabel} Balance`
                )}
            </Button>
        </form>
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children || <Button variant="outline">Manage Balance</Button>}
            </SheetTrigger>
            <SheetContent className="border-l border-white/10 bg-slate-950/80 backdrop-blur-2xl sm:max-w-md overflow-y-auto">
                <SheetHeader className="pb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Wallet size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/80">Vault System</span>
                    </div>
                    <SheetTitle className="text-3xl font-extrabold tracking-tight">Financial Hub</SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Securely manage your capital allocation and account liquidity.
                    </SheetDescription>
                </SheetHeader>

                <Tabs value={formData.mode} onValueChange={(v) => handleFormChange("mode", v as any)} className="w-[90%] ms-5">
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-white/5 p-1 rounded-xl border border-white/5">
                        <TabsTrigger value="add" className="rounded-lg data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                            <ArrowUpCircle className="w-4 h-4 mr-1" /> Add
                        </TabsTrigger>
                        <TabsTrigger value="rem" className="rounded-lg data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                            <ArrowDownCircle className="w-4 h-4 mr-1" /> Remove
                        </TabsTrigger>
                        <TabsTrigger value="mod" className="rounded-lg data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                            <RefreshCw className="w-4 h-4 mr-1" /> Mod
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="add">{renderForm("Deposit", "bg-green-600 hover:bg-green-500 shadow-green-900/20")}</TabsContent>
                    <TabsContent value="rem">{renderForm("Withdraw", "bg-red-600 hover:bg-red-500 shadow-red-900/20")}</TabsContent>
                    <TabsContent value="mod">{renderForm("Adjust", "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20")}</TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}