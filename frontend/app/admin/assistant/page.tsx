import { Metadata } from "next";
import AssistantClient from "./AssistantClient";

export const metadata: Metadata = {
    title: "AI Financial Assistant & Portfolio Auditor - Trade Tracker",
    description: "Coming soon.",
};

export default function AssistantPage() {
    return <AssistantClient />;
}
