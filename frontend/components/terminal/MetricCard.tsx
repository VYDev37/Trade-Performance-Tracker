import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
    label: string;
    value: string;
    unit?: string;
    progress: number;
    sub?: string;
    color?: "green" | "yellow" | "red";
}

export default function MetricCard({ label, value, unit, progress, sub, color = "green" }: MetricCardProps) {
    const themes = {
        green: "bg-emerald-500 shadow-emerald-500/20 text-emerald-400",
        yellow: "bg-amber-500 shadow-amber-500/20 text-amber-400",
        red: "bg-rose-500 shadow-rose-500/20 text-rose-400",
    };

    return (
        <Card className="bg-zinc-900/60 border-white/5 hover:border-emerald-500/30 transition-all group">
            <CardContent className="p-6">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-4 block">{label}</span>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl lg:text-3xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors">{value}</span>
                    {unit && <span className="text-sm font-mono text-zinc-500">{unit}</span>}
                </div>
                <div className="h-1.5 bg-white/5 w-full rounded-full overflow-hidden">
                    <div className={`h-full ${themes[color].split(' ')[0]} transition-all duration-700`} style={{ width: `${progress}%` }} />
                </div>
                {sub && <span className="text-[9px] font-bold text-zinc-600 mt-4 block tracking-tighter uppercase">{sub}</span>}
            </CardContent>
        </Card>
    );
};