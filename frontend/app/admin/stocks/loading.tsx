import { Card } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-col w-full pt-3 pb-6 space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-zinc-800 rounded"></div>

            <Card className="border-white/5 h-[300px] md:h-[450px] bg-zinc-900/40 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            </Card>

            <div className="my-6 md:my-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-32 bg-zinc-800 rounded"></div>
                    <div className="h-10 w-36 bg-zinc-800 rounded"></div>
                </div>
                <Card className="border-white/5 p-6 bg-zinc-900/40 space-y-4">
                    <div className="h-6 w-full bg-zinc-800 rounded"></div>
                    <div className="h-6 w-full bg-zinc-800 rounded"></div>
                    <div className="h-6 w-full bg-zinc-800 rounded"></div>
                </Card>
            </div>
        </div>
    );
}
