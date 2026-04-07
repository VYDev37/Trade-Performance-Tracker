"use client"

import { useState, useEffect } from "react";
import { axios } from "@/app/lib";

import type { JournalInfo } from "@/app/types/user/JournalInfo";

export default function useGetNotes() {
    const [notes, setNotes] = useState<JournalInfo[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshNote = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await axios.get("/notes/get");
            // console.log(result.data);
            setNotes(result.data.notes);
            return true;
        } catch (err: any) {
            setError(err.message || "Failed to add note.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshNote();
    }, []);

    return { notes, loading, error, refreshNote };
}