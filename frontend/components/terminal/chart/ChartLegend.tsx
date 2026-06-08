import type { Candle } from "@/schemas/asset.schema";
import { Formatter } from "@/lib";

interface LegendProps {
    symbol: string;
    data?: Candle;
}

const ChartLegend = ({ symbol, data }: LegendProps) => {
    if (!data)
        return <div className="legend-title text-white font-bold">{symbol}</div>;

    const isUp = data.close >= data.open;
    const color = isUp ? '#26a69a' : '#ef5350';

    return (
        <div className="chart-legend-container text-white font-bold">
            <div className="symbol-title">{symbol}</div>
            <div className="text-[0.6rem] lg:text-xs font-mono">
                <div>
                    <span>O <b style={{ color }}>{Formatter.formatNumber(data.open)}</b></span>
                    <span className="ms-2">H <b style={{ color }}>{Formatter.formatNumber(data.high)}</b></span>
                    <span className="ms-2">L <b style={{ color }}>{Formatter.formatNumber(data.low)}</b></span>
                    <span className="ms-2">C <b style={{ color }}>{Formatter.formatNumber(data.close)}</b></span>
                </div>
                <div>
                    <span>Vol <b style={{ color: '#d1d4dc' }}>{Formatter.formatLargeNumber(data.volume)}</b></span>
                </div>
            </div>
            {/* Indicators later? */}
            {/* <div className="indicator-data-row text-xs font-mono">
                <span>BB <b style={{ color }}>{data.open.toFixed(2)}</b></span>
            </div> */}
        </div>
    );
};

export default ChartLegend;