"use client"

import { useState } from "react";

import { LoginRequest, LoginResponse } from "@/app/types/http/LoginInfo";
import { axios } from "@/app/lib";
import { useUser } from "@/app/context/UserContext";

export default function useLogin() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { login: syncUserContext } = useUser();

    const login = async (credentials: LoginRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/account/login", credentials);
            const data: LoginResponse = res.data;

            if (res.status !== 200)
                throw new Error(data.message || "Login failed");

            // console.log(res.data);

            if (data.token) {
                await syncUserContext(data.token);
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { login, loading, error };
}