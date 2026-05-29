import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="w-full mb-10 space-y-5 animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Skeleton className="h-9 w-48 bg-zinc-900/50" />
                <Skeleton className="h-10 w-64 bg-zinc-900/50 rounded-md" />
            </div>

            {/* Layout summary skeleton card */}
            <Card className="flex flex-col w-full border-white/5 bg-zinc-950/50 mt-5">
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <Skeleton className="h-6 w-56 bg-zinc-900/50" />
                        <Skeleton className="h-9 w-24 bg-zinc-900/50 rounded-md" />
                    </div>
                </CardHeader>
                <div className="h-[1px] bg-white/10 w-full" />
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {Array.from({ length: 11 }).map((_, idx) => (
                        <Card key={idx} className="bg-zinc-900/40 border-white/5">
                            <CardContent className="flex items-center p-4">
                                <Skeleton className="h-12 w-12 rounded-lg bg-zinc-900/60" />
                                <div className="flex flex-col ml-5 gap-2 flex-1">
                                    <Skeleton className="h-4 w-24 bg-zinc-900/60" />
                                    <Skeleton className="h-5 w-32 bg-zinc-900/60" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
