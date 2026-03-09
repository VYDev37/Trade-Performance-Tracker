"use client"

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function StockChart({ symbol = "COMPOSITE" }) {
    const container = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `IDX:${symbol}`,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_chart"
        });

        const observer = new MutationObserver(() => {
            if (container.current?.querySelector('iframe')) {
                setIsLoading(false);
                observer.disconnect();
            }
        });

        if (container.current) {
            observer.observe(container.current, { childList: true, subtree: true });
            container.current.appendChild(script);
        }

        return () => {
            observer.disconnect();
            if (container.current)
                container.current.innerHTML = "";
        }
    }, [symbol]);

    return (
        <div className="relative h-[500px] w-full bg-zinc-950 rounded-xl overflow-hidden border border-white/5">
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 text-sky-500 animate-spin mb-4" />
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
                        Loading Chart {symbol}...
                    </p>
                </div>
            )}

            <div id="tradingview_chart" ref={container} className="h-full w-full" />
        </div>
    );
}