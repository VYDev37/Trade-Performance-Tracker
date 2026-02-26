import { UserStatValue } from "@/app/components/dashboard";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface DashboardInfo {
    title: string;
    icon: string;
    color: "green" | "yellow" | "red";
    field: "balance" | "total_equity" | "positions_count" |
    "top_gain" | "top_loss" | "loss_amount" |
    "gain_amount" | "loss_gain_sum" | "winning_positions" |
    "losing_positions" | "temp_win_rate";
    isCurrency?: boolean;
    useDynamicColor?: boolean;
    textColor?: "text_green" | "text_red";
}

export default function Page() {
    const colors: Record<string, string> = {
        green: "bg-green-600 shadow-green-900/20",
        yellow: "bg-yellow-600 shadow-yellow-900/20",
        red: "bg-red-600 shadow-red-900/20",
        text_red: "text-red-600",
        text_green: "text-green-600"
    };

    const infos: DashboardInfo[] = [
        { title: "Stock count", icon: "fa-box", color: "green", field: "positions_count" },
        { title: "Balance", icon: "fa-wallet", color: "green", field: "balance", isCurrency: true },
        { title: "Total Equity", icon: "fa-store", color: "yellow", field: "total_equity", isCurrency: true },
        { title: "Gain Total (Unrealized)", icon: "fa-cash-register", color: "green", field: "gain_amount", isCurrency: true, textColor: "text_green" },
        { title: "Loss Total (Unrealized)", icon: "fa-file", color: "red", field: "loss_amount", isCurrency: true, textColor: "text_red" },
        { title: "Unrealized PnL Total", icon: "fa-folder", color: "yellow", field: "loss_gain_sum", isCurrency: true, useDynamicColor: true },
        { title: "Winning Positions (Unrealized)", icon: "fa-folder", color: "green", field: "winning_positions" },
        { title: "Losing positions (Unrealized)", icon: "fa-folder", color: "red", field: "losing_positions" },
        { title: "Current Win Rate (Unrealized)", icon: "fa-folder", color: "green", field: "temp_win_rate" },
        { title: "Top Gainer Ticker (Unrealized)", icon: "fa-folder", color: "green", field: "top_gain" },
        { title: "Top Loser Ticker (Unrealized)", icon: "fa-folder", color: "red", field: "top_loss" }
    ];

    return (
        <div className="w-full mb-10">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Card className="flex flex-col w-[90%] mt-5 mb-10 border-white/5 bg-zinc-950/50">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <p className="text-lg">Summary of current account</p>
                        <Link href="/admin/profile" className={buttonVariants({ variant: "gradient" })}>
                            View more
                        </Link>
                    </CardTitle>
                </CardHeader>
                <div className="h-[1px] bg-white/10 w-full" />
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {infos.map((info, idx) => (
                        <Card key={idx} className="bg-zinc-900/40 border-white/5">
                            <CardContent className="flex items-center p-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors[info.color]} text-black shadow-lg`}>
                                    <i className={`fas ${info.icon} text-lg`}></i>
                                </div>
                                <div className="flex flex-col ml-5">
                                    <div className="text-sm text-zinc-400">{info.title}</div>
                                    <div className={`text-lg ${info.textColor ? colors[info.textColor] : "text-white"}`}>
                                        <UserStatValue field={info.field as any} isCurrency={info.isCurrency} useDynamicColor={info.useDynamicColor} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}