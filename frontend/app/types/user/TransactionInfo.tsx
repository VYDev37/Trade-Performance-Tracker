export interface TransactionInfo {
    id: number;
    ticker: string;
    transaction_type: string;
    owner_id: number;
    transaction_fee: number;
    quantity: number;
    base_price: number;
    price: number;
    realized_pnl: number;
    price_per_unit: number;
    notes: string;

    created_at: Date;
}