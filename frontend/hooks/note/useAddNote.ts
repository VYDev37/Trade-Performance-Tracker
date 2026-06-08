"use client"

import { useState } from "react";
import { axios } from "@/lib";
import z from "zod";

import { JournalInfoSchema, type JournalInfo } from "@/schemas/journal.schema";

export default function useAddNote() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addNote = async (formData: JournalInfo) => {
        setLoading(true);
        setError(null);

        try {
            const parsedData = JournalInfoSchema.parse(formData);

            await axios.post("/notes/add", {
                title: parsedData.title,
                description: parsedData.description,
                image_url: parsedData.image_url,
                category: parsedData.category
            });

            return true;
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                setError(err.issues.map((issue) => issue.message).join(", "));
            } else {
                setError(err.message || "Failed to add note.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { addNote, loading, error, setError };
}