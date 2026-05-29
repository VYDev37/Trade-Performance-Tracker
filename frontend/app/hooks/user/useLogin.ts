"use client"

import z from "zod";
import { useState } from "react";

import { LoginRequest, LoginResponseSchema } from "@/app/schemas/auth.schema";
import { axios } from "@/app/lib";
import { useUser } from "@/app/stores";

export default function useLogin() {
    const [error, setError] = useState<string | null>(null);

    const syncUser = useUser((state) => state.login);
    const loading = useUser((state) => state.isLoading);

    const login = async (credentials: LoginRequest): Promise<boolean> => {
        setError(null);

        try {
            const res = await axios.post("/account/login", credentials);
            const result = LoginResponseSchema.parse(res.data);

            if (result.code !== 200)
                throw new Error(result.message || "Login failed");

            console.log(result);
            if (result.token) {
                await syncUser(result.token);
                return true;
            }
            return false;
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                setError("Server sent invalid data format");
            } else {
                setError(err.message || "An unexpected error occurred");
            }
            return false;
        }
    }

    return { login, loading, error };
}