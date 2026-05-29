import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="container px-4 w-full space-y-8 animate-pulse pt-2">
            {/* Header skeleton */}
            <div className="flex justify-between items-center w-full">
                <Skeleton className="h-9 w-40 bg-zinc-900/50" />
                <Skeleton className="h-10 w-28 bg-zinc-900/50 rounded-md" />
            </div>

            {/* Note cards grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 items-start w-full">
                {Array.from({ length: 10 }).map((_, idx) => (
                    <Card key={idx} className="bg-zinc-900/40 border-white/5 h-44">
                        <CardContent className="flex flex-col p-4 gap-3">
                            <Skeleton className="h-5 w-24 bg-zinc-900/60" />
                            <Skeleton className="h-4 w-full bg-zinc-900/60" />
                            <Skeleton className="h-4 w-5/6 bg-zinc-900/60" />
                            <div className="mt-auto flex justify-between items-center pt-2">
                                <Skeleton className="h-3 w-16 bg-zinc-900/60" />
                                <Skeleton className="h-5 w-5 bg-zinc-900/60 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
