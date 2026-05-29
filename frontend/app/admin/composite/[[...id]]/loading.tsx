import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col h-full py-4 md:py-6 font-mono gap-4 w-full">
            {/* Header skeleton */}
            <div className="flex items-center justify-between px-4 pb-4">
                <Skeleton className="h-8 w-40 bg-zinc-900/50 border border-white/5 rounded" />
                <Skeleton className="h-10 w-10 bg-zinc-900/50 border border-white/5 rounded lg:hidden" />
            </div>

            <div className="flex flex-col lg:flex-row flex-1 gap-4 md:gap-6 px-4 lg:px-0">
                {/* Desktop sidebar list skeleton */}
                <div className="hidden lg:flex w-80 flex-col border border-white/10 bg-zinc-900/50 rounded-lg p-4 gap-4">
                    <Skeleton className="h-6 w-32 bg-zinc-900" />
                    <Skeleton className="h-10 w-full bg-zinc-900" />
                    <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <Skeleton key={idx} className="h-12 w-full bg-zinc-900/60" />
                        ))}
                    </div>
                </div>

                {/* Main terminal dashboard skeleton */}
                <div className="flex-1 flex flex-col gap-6">
                    <Skeleton className="h-28 w-full bg-zinc-900/50 border border-white/10 rounded-lg" />
                    <Skeleton className="h-96 w-full bg-zinc-900/50 border border-white/10 rounded-lg" />
                    <Skeleton className="h-48 w-full bg-zinc-900/50 border border-white/10 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
