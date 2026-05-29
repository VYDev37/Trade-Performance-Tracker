import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col p-5 md:p-6 bg-zinc-950 text-zinc-50 animate-pulse">
            <Card className="flex flex-1 flex-col border-zinc-800 bg-zinc-900/50 shadow-2xl">
                <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4">
                    <CardTitle className="flex items-center gap-2 text-zinc-100">
                        <Bot className="h-5 w-5 text-indigo-400/40" />
                        <div className="h-5 w-40 bg-zinc-800 rounded"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 space-y-4 overflow-hidden">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-[250px] bg-zinc-800 rounded-2xl rounded-tl-none"></div>
                            <div className="h-4 w-[180px] bg-zinc-800 rounded-2xl rounded-tl-none"></div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 flex-row-reverse">
                        <div className="h-8 w-8 rounded-full bg-zinc-800"></div>
                        <div className="h-10 w-[200px] bg-zinc-800 rounded-2xl rounded-tr-none"></div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                    <div className="flex w-full items-center gap-2">
                        <div className="flex-1 h-10 bg-zinc-950/50 border border-zinc-800 rounded-md"></div>
                        <div className="h-10 w-10 bg-zinc-800 rounded-md"></div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
