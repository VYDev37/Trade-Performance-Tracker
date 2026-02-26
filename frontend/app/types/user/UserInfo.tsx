import type { PortfolioItem } from "./PortfolioInfo";

export interface UserProfile {
    name: string;
    username: string;
    balance: number;
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
