import { Card } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-col gap-8 w-full p-6 text-white min-h-screen animate-pulse">
            <div className="flex flex-col gap-2">
                <div className="h-9 w-40 bg-zinc-800 rounded"></div>
                <div className="h-5 w-80 bg-zinc-800 rounded"></div>
            </div>
            <div className="flex justify-center items-center flex-1 pb-20">
                <Card className="w-[350px] h-[450px] border-zinc-800 bg-zinc-900/40 rounded-3xl p-6 flex flex-col justify-between">
                    <div className="h-20 bg-zinc-950/50 rounded-2xl border border-zinc-800"></div>
                    <div className="grid grid-cols-4 gap-3 mt-6">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-zinc-800 rounded-2xl"></div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
