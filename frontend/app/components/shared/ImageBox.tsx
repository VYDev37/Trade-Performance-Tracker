"use client";

import CustomDialog from "./CustomDialog";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageBoxProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ImageBox({ src, alt, className }: ImageBoxProps) {
    return (
        <CustomDialog
            modal={false}
            trigger={
                <div className={cn(
                    "relative aspect-video rounded-lg overflow-hidden border border-white/10 cursor-zoom-in group",
                    className
                )}>
                    <Image src={src} alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs text-white/80 font-medium px-2 py-1 bg-black/50 rounded-full">Zoom</span>
                    </div>
                </div>
            }
            title="Image Zoom Preview"
            hideTitle={true}
            contentClassName="max-w-[95vw] max-h-[95vh] p-1 bg-black/90 overflow-hidden flex items-center justify-center"
        >
            <div className="relative w-full h-full flex items-center justify-center">
                <Image src={src} alt={alt} width={1920} height={1080} quality={100}
                    className="object-contain max-w-full max-h-[90vh] rounded-md" />
            </div>
        </CustomDialog>
    );
}