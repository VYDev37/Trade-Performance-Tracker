import { Metadata } from "next";
import TransactionClient from "./TransactionClient";

export const metadata: Metadata = {
    title: "Transaction History & Order Logs - Trade Tracker Admin",
    description: "Explore, filter, and audit your complete stock transaction history logs, order details, and execution costs inside the Trade Tracker.",
};

export default function Page() {
    return <TransactionClient />
}
