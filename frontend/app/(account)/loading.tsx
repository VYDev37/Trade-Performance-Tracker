import { Card } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4 animate-pulse">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-8 w-40 bg-zinc-800 rounded"></div>
                    <div className="h-4 w-60 bg-zinc-800 rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-zinc-800 rounded"></div>
                        <div className="h-11 w-full bg-zinc-800 rounded-md"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-16 bg-zinc-800 rounded"></div>
                        <div className="h-11 w-full bg-zinc-800 rounded-md"></div>
                    </div>
                </div>
                <div className="h-11 w-full bg-zinc-800 rounded-md"></div>
                <div className="h-4 w-48 bg-zinc-800 rounded mx-auto"></div>
            </Card>
        </div>
    );
}
