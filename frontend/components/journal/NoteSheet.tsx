"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

import { useAddNote, useUpdateNote } from "@/hooks";
import type { JournalInfo } from "@/schemas/journal.schema";

import { PenIcon } from "lucide-react";
import NoteForm from "./NoteForm";

interface NoteSheetProps {
    onRefresh: () => void;
    existingData?: JournalInfo;
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function NoteSheet({ onRefresh, existingData, isOpen, onOpenChange }: NoteSheetProps) {
    const { addNote, loading: addLoading, error: addError, setError: setAddError } = useAddNote();
    const { updateNote, loading: updateLoading, error: updateError, setError: setUpdateError } = useUpdateNote();

    const error = existingData ? updateError : addError;

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setAddError(null);
            setUpdateError(null);
        }
        onOpenChange(open);
    };

    const handleAddNote = async (data: JournalInfo) => {
        if (!data.title.trim() || !data.description.trim() || !data.category.trim()) {
            existingData ? setUpdateError("Please fill out all required fields.") : setAddError("Please fill out all required fields.");
            return;
        }
        
        if (updateLoading || addLoading) return;

        try {
            const res = existingData ? await updateNote(existingData.id!, data) : await addNote(data);
            if (res) {
                // setData({ title: "", image_url: [], description: "", category: "" });
                handleOpenChange(false);

                if (onRefresh)
                    onRefresh();
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange} modal={false}>
            {!existingData && (
                <SheetTrigger asChild>
                    <Button variant="gradient">
                        <PenIcon className="w-4 h-4 mr-2" /> Compose
                    </Button>
                </SheetTrigger>
            )}
            <SheetContent onInteractOutside={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="bg-zinc-950 text-white border-white/10 sm:max-w-md overflow-y-auto w-full">
                <SheetHeader>
                    <SheetTitle className="text-white">{existingData ? "Edit Note" : "New Note"}</SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        {existingData ? `Edit Note for '${existingData.title}'` : "Create a new note. Fill out the details below."}
                    </SheetDescription>
                </SheetHeader>
                <NoteForm key={existingData ? `edit-${existingData.id}` : "new"} onSubmit={handleAddNote} existingData={existingData} loading={existingData ? updateLoading : addLoading} error={error} />
            </SheetContent>
        </Sheet>
    )
}