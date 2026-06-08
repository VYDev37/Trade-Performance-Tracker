import Formatter from "@/lib/formatter";

interface TickerItemProps {
    company_name: string;
    ticker: string;
    price: number;
    change: number;
    isPositive: boolean;
    active: boolean;
    onClick: () => void;
}

export default function TickerItem({ company_name, ticker, price, change, isPositive, active, onClick }: TickerItemProps) {
    return (
        <div
            onClick={onClick}
            className={`p-4 cursor-pointer transition-all border-l-[3px] ${active ? 'bg-emerald-500/5 border-emerald-500' : 'hover:bg-white/5 border-transparent opacity-60'}`}
        >

            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm font-black ${active ? 'text-white' : 'text-zinc-400'}`}>{ticker}</span>
                    <span className="text-sm font-bold text-white">{Formatter.formatNumber(price)}</span>
                </div>
                <span className={`text-[10px] truncate w-[80%] font-black ${active ? 'text-white' : 'text-zinc-400'}`}>{company_name}</span>
            </div>
            <div className="flex justify-between items-end text-[9px] font-bold mt-1.5">
                <span className="text-zinc-600 tracking-wider">IHSG_ASSET</span>
                <span className={isPositive ? 'text-emerald-400' : 'text-rose-500'}>{Formatter.formatPercent(change)}</span>
            </div>
        </div>
    );
}