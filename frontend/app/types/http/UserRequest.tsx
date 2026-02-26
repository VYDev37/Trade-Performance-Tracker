export interface UserBalanceReq {
    amount: number;
    fee: number;
    mode: "add" | "rem" | "mod";
    note: string;
    bank_src: string;
}