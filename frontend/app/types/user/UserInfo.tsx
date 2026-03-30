import type { PortfolioItem } from "./PortfolioInfo";
import type { BalanceInfo } from "./BalanceInfo";

export interface UserProfile {
    name: string;
    username: string;
    balance: BalanceInfo;
    total_equity: number;
    positions?: PortfolioItem[];
}

export interface UserContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}
