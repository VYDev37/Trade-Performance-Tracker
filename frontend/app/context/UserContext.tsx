"use client";

import Cookies from "js-cookie";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { axios } from "@/app/lib";

import { UserProfile, UserContextType } from "@/app/types/user/UserInfo";
import { useRouter, usePathname } from "next/navigation";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter();
    const pathname = usePathname();

    const refreshProfile = useCallback(async () => {
        if (!pathname.startsWith("/admin")) {
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.get<{ data: UserProfile }>("/user/me");
            setUser(data.data);
        } catch (error) {
            console.error("Failed to load profile:", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [pathname]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const login = useCallback(async (token: string) => {
        Cookies.set("token", token, { path: "/" });
        setIsLoading(true);

        await refreshProfile();
        router.push("/admin/dashboard");
    }, [refreshProfile, router]);

    const logout = useCallback(async () => {
        try {
            await axios.post("/account/logout");
        } catch (err) {
            console.error("Logout from server failed: ", err);
        }
        finally {
            Cookies.remove("token");
            setUser(null);

            router.push("/login");
        }
    }, [router]);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            refreshProfile,
        }),
        [user, isLoading, refreshProfile, login, logout]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};