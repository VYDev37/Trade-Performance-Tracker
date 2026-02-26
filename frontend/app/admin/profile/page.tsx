"use client";

import { useUser } from "@/app/context/UserContext";
import { AccountSummaryCard, PortfolioOverviewCard, PortfolioPieChart } from "@/app/components/profile";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { UserCircle, AlertCircle } from "lucide-react";

export default function ProfilePage() {
    const { user, isLoading } = useUser();

    return (
        <div className="container py-8 px-4 w-[90%] md:w-[95%] space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <UserCircle className="h-8 w-8 text-blue-500 mt-1" />
                        My Profile
                    </h1>
                    <p className="text-muted-foreground mt-3">View your account summary and top portfolio performance.</p>
                </div>
            </div>

            {isLoading ? (
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
            ) : !user ? (
                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center justify-center p-12 text-center text-red-400">
                            <AlertCircle className="h-10 w-10 mb-4" />
                            <p>Failed to load profile data. Please try again later.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    <AccountSummaryCard user={user} />
                    <PortfolioOverviewCard portfolio={user.positions} />
                    <PortfolioPieChart positions={user.positions} />
                </div>
            )}
        </div>
    );
}
