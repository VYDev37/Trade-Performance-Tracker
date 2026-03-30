export interface UserBalanceReq {
    amount: number | string;
    fee: number | string;
    mode: "add" | "rem" | "mod";
    asset_type: "stock_balance" | "cash_balance";
    note: string;
    bank_src: string;
    title?: string;
}