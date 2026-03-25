"use client";

import { useState } from "react";
import { axios } from "@/app/lib";
import { JournalInfo } from "@/app/types/user/JournalInfo";

export default function useUpdateNote() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateNote = async (id: number, data: JournalInfo) => {
        setLoading(true);
        setError(null);

        try {
            await axios.put(`/notes/update/${id}`, data);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add note.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateNote, loading, error };
}