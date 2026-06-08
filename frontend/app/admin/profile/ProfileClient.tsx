"use client";

import { useUser } from "@/stores";
import { AccountSummaryCard, PortfolioOverviewCard } from "@/components/profile";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { UserCircle, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Bundle optimization via dynamic imports (Section 5 compliant)
const PortfolioPieChart = dynamic(() => import('@/components/profile/PortfolioPieChart'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[350px] bg-slate-900/40 rounded-2xl border border-white/10" />
});

export default function ProfileClient() {
    const user = useUser((state) => state.user);
    const isLoading = useUser((state) => state.isLoading);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (isLoading || !mounted) {
        return (
            <div className="container py-8 px-4 w-full space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <UserCircle className="h-8 w-8 text-blue-500 mt-1" />
                            My Profile
                        </h1>
                        <p className="text-muted-foreground mt-3">View your account summary and top portfolio performance.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                            <Skeleton className="h-8 w-1/3 bg-slate-800 mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton className="h-24 w-full bg-slate-800 rounded-xl" />
                                <Skeleton className="h-24 w-full bg-slate-800 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                            <Skeleton className="h-8 w-1/4 bg-slate-800 mb-6" />
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
                                <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
                                <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container py-8 px-4 w-full space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            <UserCircle className="h-8 w-8 text-blue-500 mt-1" />
                            My Profile
                        </h1>
                        <p className="text-muted-foreground mt-3">View your account summary and top portfolio performance.</p>
                    </div>
                </div>

                <Card className="border-slate-800 bg-slate-955/50 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center justify-center p-12 text-center text-red-400">
                            <AlertCircle className="h-10 w-10 mb-4" />
                            <p>Failed to load profile data. Please try again later.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-8 px-4 w-full space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <UserCircle className="h-8 w-8 text-blue-500 mt-1" />
                        My Profile
                    </h1>
                    <p className="text-muted-foreground mt-3">View your account summary and top portfolio performance.</p>
                </div>
            </div>

            <div className="space-y-8">
                <AccountSummaryCard user={user} />
                <PortfolioOverviewCard portfolio={user?.positions.items} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-2">Current Exposure</p>
                        <PortfolioPieChart positions={user.positions.items} isCapital={false} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-2">Initial Investment</p>
                        <PortfolioPieChart positions={user.positions.items} isCapital={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
