import z from "zod";
import { create } from "zustand";
import { TransactionListSchema, type TransactionInfo, type AvailableAccount } from "@/schemas/transaction.schema";
import { axios } from "@/lib";

interface TransactionStore {
    transactions: TransactionInfo[];
    loading: boolean;
    error: string | null;
    availableAccounts: AvailableAccount[],
    selectedAccount: string;
    setSelectedAccount: (account: string) => void;
    refetch: (silent?: boolean) => Promise<void>;
    init: () => Promise<void>;
    fetchAccounts: (assetType: string) => Promise<void>;
};

export const useTransaction = create<TransactionStore>((set, get) => ({
    transactions: [],
    loading: false,
    error: null,
    availableAccounts: [],
    selectedAccount: "all",
    setSelectedAccount: (account: string) => set({ selectedAccount: account }),
    init: async () => {
        if (!get().transactions.length)
            await get().refetch();
    },
    refetch: async (silent = false) => {
        if (!silent)
            set({ error: null, loading: true });
        try {
            const result = await axios.get("/transactions/my-info");
            const raw = result.data.transactions;
            const data = TransactionListSchema.parse(raw);
            set({ transactions: data });
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                set({ error: "Server sent invalid transaction format." });
            } else {
                set({ error: err.message || "Failed to get transactions." });
            }
        } finally {
            if (!silent)
                set({ loading: false });
        }
    },
    fetchAccounts: async (assetType: string) => {
        set({ loading: true, error: null })
        try {
            const res = await axios.get(`/balance/accounts/${assetType}`);
            if (res.data && res.data.accounts) {
                set({ availableAccounts: res.data.accounts });
            }
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                set({ error: "Server sent invalid transaction format." });
            } else {
                set({ error: err.message || "Failed to get transactions." });
            }
        } finally {
            set({ loading: false });
        }
    }
}));