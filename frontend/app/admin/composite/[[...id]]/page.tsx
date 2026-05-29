import { Metadata } from "next";
import CompositeClient from "./CompositeClient";

interface PageProps {
    params: Promise<{ id?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const ticker = resolvedParams.id?.[0] || "BBCA";
    return {
        title: `IDX Composite Terminal - ${ticker}`,
        description: `Real-time stock details, charts, and core fundamentals for ticker ${ticker} on the IDX Composite Terminal.`,
    };
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    return <CompositeClient initialId={resolvedParams.id} />;
}
