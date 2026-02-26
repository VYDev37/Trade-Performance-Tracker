export interface PortfolioAddReq {
    ticker: string;
    qty: number;
    inv: number;
    fee: number;
}

export interface PortfolioItem {
    ticker: string;
    total_qty: number;
    invested_total: number;
    current_price: number;
    unrealized_pnl: number;
    pnl_percentage: number;
    updated_at: Date;
}