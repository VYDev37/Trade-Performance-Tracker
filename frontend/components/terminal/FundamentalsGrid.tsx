import MetricCard from "./MetricCard";
import Formatter from "@/lib/formatter";
import { AssetInfo } from "@/schemas/asset.schema";

interface FundamentalsGridProps {
    detailData: AssetInfo | null;
}

export default function FundamentalsGrid({ detailData }: FundamentalsGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            <MetricCard
                label="MARKET_CAP"
                value={Formatter.formatLargeNumber(detailData?.market_cap)}
                unit=""
                progress={100}
                sub="VALUATION"
                color="green"
            />
            <MetricCard
                label="P/E_RATIO"
                value={Formatter.formatNumber(detailData?.pe_ratio)}
                unit="x"
                progress={Math.min(100, detailData?.pe_ratio || 0)}
                sub="VALUATION_METRIC"
                color={detailData?.pe_ratio && detailData.pe_ratio > 20 ? "red" : "green"}
            />
            <MetricCard
                label="PBV_RATIO"
                value={Formatter.formatNumber(detailData?.pbv)}
                unit="x"
                progress={Math.min(100, (detailData?.pbv || 0))}
                sub="PRICE_TO_BOOK"
                color="yellow"
            />
            <MetricCard
                label="ROE_PERCENT"
                value={Formatter.formatNumber(detailData?.roe)}
                unit="%"
                progress={Math.min(100, (detailData?.roe || 0))}
                sub="PROFITABILITY"
                color={detailData?.roe && detailData.roe > 15 ? "green" : "yellow"}
            />
        </div>
    );
}
