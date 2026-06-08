"use client"

import { useState } from "react";

import { axios } from "@/lib";
import { RegisterRequest, RegisterResponseSchema } from "@/schemas/auth.schema";

export default function useRegister() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (info: RegisterRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/account/register", info);
            const result = RegisterResponseSchema.parse(res.data);

            if (result.code !== 200)
                throw new Error(result.message || "Registration failed");

            return true;
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
}
