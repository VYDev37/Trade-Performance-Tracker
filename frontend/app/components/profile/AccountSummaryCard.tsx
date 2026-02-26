import type { UserProfile } from "@/app/types/user/UserInfo";
import { Formatter } from "@/app/lib";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants, Button } from "@/components/ui/button";
import { ManageBalanceSheet } from "./helper";

import Link from "next/link";
import { Wallet, Landmark, UserCircle, PlusCircleIcon } from "lucide-react";

interface AccountSummaryCardProps {
    user: UserProfile;
}

export default function AccountSummaryCard({ user }: AccountSummaryCardProps) {
    return (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4 border-b border-slate-800/50">
                <CardTitle className="text-xl flex flex-col sm:flex-row text-white justify-between gap-4 sm:items-center">
                    <div className="flex flex-row items-center gap-3">
                        <UserCircle className="h-8 w-8 shrink-0 text-blue-500" />
                        <div className="min-w-0">
                            <div className="font-bold tracking-tight truncate">@{user.username}</div>
                            <div className="text-sm font-normal text-slate-400 mt-0.5 truncate">{user.name}</div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <ManageBalanceSheet>
                            <Button variant="secondary" className="flex-1 sm:flex-none gap-2 px-2 sm:px-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] transition-all active:scale-95 text-xs sm:text-sm">
                                <PlusCircleIcon className="w-4 h-4 shrink-0" /> <span className="truncate">Add Cash</span>
                            </Button>
                        </ManageBalanceSheet>
                        <Link href="/admin/dashboard" className={`flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 ${buttonVariants({ variant: "gradient" })}`}>
                            <span className="truncate">More details</span>
                        </Link>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Cash Balance */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 transition-colors hover:bg-slate-800/50">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-400 mb-1 truncate">Cash Balance</p>
                            <p className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                                {Formatter.toCurrency(user.balance)}
                            </p>
                        </div>
                    </div>

                    {/* Total Equity */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 transition-colors hover:bg-slate-800/50">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">
                            <Landmark className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-400 mb-1 truncate">Total Equity</p>
                            <p className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                                {Formatter.toCurrency(user.total_equity)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
