import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6 md:space-y-8 w-full pt-3 pb-6">
            <Skeleton className="h-32 md:h-40 w-full rounded-2xl bg-slate-900/50 border border-slate-800" />
            <Skeleton className="h-28 md:h-32 w-full rounded-2xl bg-slate-900/50 border border-slate-800" />
            <Skeleton className="h-[400px] w-full rounded-2xl bg-slate-900/50 border border-slate-800" />
        </div>
    );
}
