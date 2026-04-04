"use client";

import { useState } from "react";
import { Ghost } from "lucide-react";

import NoteSheet from "./NoteSheet";

interface NoteEmptyProps {
    onRefresh: () => void;
}

export default function NoteEmpty({ onRefresh }: NoteEmptyProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full rounded-xl border-2 border-dashed border-white/5 bg-zinc-900/20 p-8 text-center animate-in fade-in duration-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900/50 border border-white/10 mb-6">
                <Ghost className="h-10 w-10 text-zinc-500" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
                Nothing to see here
            </h3>

            <p className="max-w-[300px] text-sm text-zinc-400 mb-8">
                Start recaping your strategies by writing it down here. What you wrote today and yesterday might be important in the future.
            </p>

            <NoteSheet onRefresh={onRefresh} isOpen={open} onOpenChange={setOpen} />
            {/* <Button
                variant="outline"
                className="gap-2 border-white/10 hover:bg-white/5 text-zinc-300"
                onClick={() => setOpen(!open)}
            >
                <Plus className="h-4 w-4" />
                Compose
            </Button> */}
        </div>
    )
}