"use client";

import { useState } from "react";
import { axios } from "@/app/lib";
import z from "zod";

import { JournalInfoSchema, type JournalInfo } from "@/app/schemas/journal.schema";

export default function useUpdateNote() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateNote = async (id: number, data: JournalInfo) => {
        setLoading(true);
        setError(null);

        try {
            // Strict runtime validation
            const parsedData = JournalInfoSchema.parse(data);

            await axios.put(`/notes/update/${id}`, parsedData);
            return true;
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                setError(err.issues.map((issue) => issue.message).join(", "));
            } else {
                setError(err.message || "Failed to update note.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateNote, loading, error };
}