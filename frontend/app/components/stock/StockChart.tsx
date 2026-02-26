"use client"

import { useEffect, useRef } from "react";

export default function StockChart({ symbol = "BBRI" }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `${symbol}`,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_chart"
        });
        container.current?.appendChild(script);

        return () => {
            if (container.current)
                container.current.innerHTML = "";
        }
    }, [symbol]);

    return <div id="tradingview_chart" ref={container} className="h-[500px] w-full" />;
}