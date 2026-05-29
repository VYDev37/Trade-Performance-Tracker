import { LucideIcon } from "lucide-react";

interface TableCardRows {
    label: string;
    color: string;
    value: any;
}

interface TableCardProps {
    title: string;
    icon: LucideIcon;
    rows: TableCardRows[];
}

export default function TableCard({ title, icon: Icon, rows }: TableCardProps) {
    return (
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h4 className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">{title}</h4>
                <Icon size={14} className="text-zinc-600" />
            </div>
            <div className="divide-y divide-white/5">
                {rows.map((row: TableCardRows, i: number) => (
                    <div key={i} className="flex justify-between p-4 text-xs">
                        <span className="text-zinc-500 font-bold">{row.label}</span>
                        <span className={`font-bold ${row.color || 'text-white'}`}>{row.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
