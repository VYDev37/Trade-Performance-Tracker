import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Info, PenIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Formatter } from '@/app/lib';
import { CustomDialog } from '@/app/components/shared';
import type { TransactionInfo } from '@/app/types/user/TransactionInfo';
import { useTransaction } from '@/app/context/TransactionContext';
import { TrackerEditSheet } from './index';

interface TrackerCombinedColumnProps {
    title: string;
    items: TransactionInfo[];
    totalCount: number;
    onViewAll: () => void;
}

export default function TrackerCombinedColumn({ title, items, totalCount, onViewAll }: TrackerCombinedColumnProps) {
    const { refetch } = useTransaction();
    const [editingItem, setEditingItem] = useState<TransactionInfo | null>(null);

    return (
        <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h2>
                <Button variant="ghost" onClick={onViewAll} className="text-[10px] bg-transparent text-slate-400 hover:text-white hover:underline font-bold uppercase">
                    View All
                </Button>
            </div>

            <div className="space-y-2">
                {items.length > 0 ? items.map((item) => {
                    const isIncome = item.transaction_type === 'income';
                    const Icon = isIncome ? ArrowUpRight : ArrowDownRight;
                    const colorClass = isIncome ? "text-emerald-500" : "text-red-500";
                    const bgClass = isIncome ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10";
                    const sign = isIncome ? "+" : "-";

                    return (
                        <div key={item.id} className="group flex items-center justify-between p-3 bg-[#14181f]/50 hover:bg-[#14181f] border border-slate-800/50 rounded-xl transition-all">
                            <div className="flex items-center gap-3 w-[65%]">
                                <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center border ${bgClass}`}>
                                    <Icon className={`w-4 h-4 ${colorClass}`} />
                                </div>
                                <div className="min-w-0 overflow-hidden">
                                    <div className="flex flex-row space-x-1 items-center">
                                        <p className="text-sm font-semibold text-slate-200 truncate">{item.title}</p>
                                        <CustomDialog trigger={
                                            <Button variant="ghost" className="h-5 w-5 p-0 flex-shrink-0">
                                                <Info className="h-3 w-3" />
                                            </Button>
                                        }
                                            title="Transaction Notes"
                                            contentClassName="sm:max-w-md"
                                        >
                                            <div className="text-slate-300 text-sm mt-4 break-words">
                                                {item.notes || "No notes available for this transaction."}
                                            </div>
                                        </CustomDialog>
                                        <Button variant="ghost" className="h-5 w-5 p-0 flex-shrink-0 text-slate-500 hover:text-white hover:bg-slate-800" onClick={() => setEditingItem(item)}>
                                            <PenIcon className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">{isIncome ? 'To' : 'From'}: {item.ticker}</p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className={`text-sm font-bold ${isIncome ? 'text-emerald-500' : 'text-red-400'}`}>
                                    {sign}{Formatter.toLocale(item.price)}
                                </p>
                                <p className="text-[9px] text-slate-600 font-medium">{Formatter.toDate(item.created_at!)}</p>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="h-14 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] text-slate-700 font-medium italic">
                            No recent activity
                        </span>
                    </div>
                )}
            </div>
            {editingItem && (
                <TrackerEditSheet
                    isOpen={!!editingItem}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                    existingData={editingItem}
                    onRefresh={refetch}
                />
            )}
        </div>
    );
}
