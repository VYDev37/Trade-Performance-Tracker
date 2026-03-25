"use client"

import { useState } from "react";
import { axios } from "@/app/lib";

import { JournalInfo } from "@/app/types/user/JournalInfo";

export default function useAddNote() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addNote = async (formData: JournalInfo) => {
        setLoading(true);
        setError(null);

        try {
            await axios.post("/notes/add", {
                title: formData.title,
                description: formData.description,
                image_url: formData.image_url,
                category: formData.category
            });

            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add note.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { addNote, loading, error };
}