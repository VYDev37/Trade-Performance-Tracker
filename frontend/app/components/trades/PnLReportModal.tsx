"use client"

import { useRef, useState } from "react";
import { toPng } from 'html-to-image';
import { Download, Share2 } from "lucide-react";

import { CustomDialog } from "@/app/components/shared";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { PnlReport } from "@/app/components/trades";
import { TransactionInfo } from "@/app/types/user/TransactionInfo";
import { PortfolioItem } from "@/app/types/user/PortfolioInfo";
import { Label } from "@/components/ui/label";

interface PnLReportModalProps {
    transaction?: TransactionInfo;
    stock?: PortfolioItem;
    username: string;
}

export default function PnLReportModal({ transaction, stock, username }: PnLReportModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState("roi");

    const handleDownload = async () => {
        if (!cardRef.current)
            return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: "#09090b"
            });

            const link = document.createElement('a');
            link.download = `Report-${transaction?.ticker || stock?.ticker}-${transaction?.id || "Unrealized"}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to generate image", error);
        }
    };

    return (
        <CustomDialog
            trigger={
                <Button variant="ghost" size="sm" className="gap-2 bg-transparent border-white/5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all">
                    <Share2 className="h-4 w-4" />
                </Button>
            }
            title="Performance Report"
            titleClassName="text-zinc-400 font-medium tracking-tight"
            contentClassName="w-[95vw] sm:max-w-[550px] shadow-2xl p-4 sm:p-6"
        >
            <div className="w-full flex flex-col items-center justify-center overflow-hidden">
                <div className="relative w-full aspect-square flex items-center justify-center scale-[0.8] sm:scale-100 origin-center transition-transform">
                    <PnlReport transaction={transaction} stock={stock} userNickname={username} mode={mode} />
                </div>

                <div className="fixed left-[-9999px] top-0 pointer-events-none">
                    <PnlReport cardRef={cardRef} transaction={transaction} stock={stock} userNickname={username} mode={mode} />
                </div>
            </div>

            <div className="flex mt-2 justify-content-center">
                <RadioGroup defaultValue="roi" className="flex gap-4 sm:gap-6 justify-center"
                    onValueChange={(value) => setMode(value)} >
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem value="roi" id="r1" className="border-sky-500 text-sky-500" />
                        <Label htmlFor="r1" className="text-zinc-400 cursor-pointer hover:text-white transition-colors">ROI</Label>
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem value="pnl" id="r2" className="border-sky-500 text-sky-500" />
                        <Label htmlFor="r2" className="text-zinc-400 cursor-pointer hover:text-white transition-colors">PnL</Label>
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem value="pnl_roi" id="r3" className="border-sky-500 text-sky-500" />
                        <Label htmlFor="r3" className="text-zinc-400 cursor-pointer hover:text-white transition-colors">PnL + ROI</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-3 mt-6">
                <Button onClick={handleDownload}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-6 rounded-xl transition-all shadow-lg active:scale-95">
                    <Download className="h-5 w-5 mr-2" /> Save Image to Device
                </Button>
                <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
                    Generated via Trading Performance Tracker
                </p>
            </div>
        </CustomDialog>
    );
}