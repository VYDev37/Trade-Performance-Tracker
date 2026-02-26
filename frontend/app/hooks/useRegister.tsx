"use client"

import { useState } from "react";

import { RegisterRequest, RegisterResponse } from "@/app/types/http/RegisterInfo";
import { axios } from "@/app/lib";

export default function useRegister() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (info: RegisterRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/account/register", info);
            const data: RegisterResponse = res.data;

            if (res.status !== 200)
                throw new Error(data.message || "Login failed");

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
