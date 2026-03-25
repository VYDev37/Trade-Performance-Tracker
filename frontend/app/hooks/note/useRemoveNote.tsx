"use client"

import { useState } from "react";
import { axios } from "@/app/lib";

export default function useRemoveNote() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeNote = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            await axios.delete(`/notes/remove/${id}`);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add note.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { removeNote, loading, error };
}