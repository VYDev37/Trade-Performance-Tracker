import { Download, Activity } from "lucide-react";
import TableCard from "./TableCard";
import { Formatter } from "@/app/lib";
import { AssetInfo } from "@/app/schemas/asset.schema";

interface FinancialTablesProps {
    detailData: AssetInfo | null;
}

export default function FinancialTables({ detailData }: FinancialTablesProps) {
    return (
        <>
            {/* Balance Sheet */}
            <TableCard
                title="BALANCE_SHEET (FQ)"
                icon={Download}
                rows={[
                    { label: "TOTAL_ASSETS", value: Formatter.formatLargeNumber(detailData?.total_assets), color: "text-white" },
                    { label: "TOTAL_LIAB", value: Formatter.formatLargeNumber(detailData?.total_liabilities), color: "text-white" },
                    { label: "TOTAL_EQUITY", value: Formatter.formatLargeNumber(detailData?.total_equity), color: "text-white" },
                    { label: "CASH_N_EQUIV", value: Formatter.formatLargeNumber(detailData?.cash_and_short_term_invest), color: "text-emerald-400" },
                ]}
            />

            {/* Cashflow / Income */}
            <TableCard
                title="INCOME_METRICS (TTM)"
                icon={Activity}
                rows={[
                    { label: "TOTAL_REVENUE", value: Formatter.formatLargeNumber(detailData?.total_revenue), color: "text-white" },
                    { label: "NET_INCOME", value: Formatter.formatLargeNumber(detailData?.net_income), color: "text-emerald-400" },
                    { label: "EBITDA", value: Formatter.formatLargeNumber(detailData?.ebitda), color: "text-white" },
                    { label: "FREE_CASHFLOW", value: Formatter.formatLargeNumber(detailData?.free_cashflow), color: "text-emerald-400" },
                ]}
            />
        </>
    );
}
