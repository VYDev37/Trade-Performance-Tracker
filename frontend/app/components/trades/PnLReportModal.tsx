"use client"

import { useRef } from "react";
import { toPng } from 'html-to-image';
import { Download, Share2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { PnlReport } from "@/app/components/trades";
import { TransactionInfo } from "@/app/types/user/TransactionInfo";

interface PnLReportModalProps {
    transaction: TransactionInfo;
    username: string;
}

export default function PnLReportModal({ transaction, username }: PnLReportModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);

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
            link.download = `Report-${transaction.ticker}-${transaction.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to generate image", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 bg-transparent border-white/5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[550px] bg-zinc-950 border-white/10 text-white shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-zinc-400 font-medium tracking-tight">Performance Report</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 overflow-hidden">
                    <div className="scale-75 sm:scale-90 origin-center transition-transform hover:scale-95 duration-500">
                        <PnlReport transaction={transaction} userNickname={username} />
                    </div>

                    <div className="fixed left-[-9999px] top-0 pointer-events-none">
                        <PnlReport cardRef={cardRef} transaction={transaction} userNickname={username} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <Button onClick={handleDownload} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                        <Download className="h-2 w-2" /> Save Image to Device
                    </Button>
                    <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
                        Generated via Trading Performance Tracker
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}