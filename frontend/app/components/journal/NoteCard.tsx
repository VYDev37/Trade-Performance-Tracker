"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Formatter } from "@/app/lib";
import { useRemoveNote } from "@/app/hooks/note";
import { ConfirmModal, ImageBox, CustomDialog } from "@/app/components/shared";
import { NoteSheet } from "@/app/components/journal";
import type { JournalInfo } from "@/app/types/user/JournalInfo";

import { MoreVertical, PenIcon, ImageIcon } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
    note: JournalInfo;
    onRefresh: () => Promise<boolean>;
}

export default function NoteCard({ note, onRefresh }: NoteCardProps) {
    const { removeNote } = useRemoveNote();

    const [open, setOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const hasImages = note.image_url && note.image_url.length > 0;
    const handleEdit = async (e: React.FormEvent) => {
        e.stopPropagation();
        setOpen(true);
    }

    const handleDelete = async () => {
        setShowDeleteConfirm(false);

        const removed = await removeNote(note.id!);
        if (removed) {
            await onRefresh();
        }
    };

    return (
        <div >
            <CustomDialog
                triggerClassName="w-full h-full"
                trigger={
                    <Card className="flex flex-col w-full h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-white/5 bg-zinc-900/50 group overflow-hidden">
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-800 flex-shrink-0">
                            <div className="absolute top-2 right-2 z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/60">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => handleEdit(e)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDeleteConfirm(true);
                                            }}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {hasImages ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <ImageBox src={note.image_url![0]} alt="Thumbnail"
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                    <PenIcon className="w-8 h-8 opacity-20" />
                                </div>
                            )}

                            {note.category && (
                                <div className="absolute top-2 left-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-500/80 backdrop-blur-md text-white rounded-md uppercase tracking-wider">
                                        {note.category}
                                    </span>
                                </div>
                            )}
                        </div>

                        <CardHeader className="p-3 space-y-1">
                            <CardTitle className="text-[13px] md:text-base font-bold leading-snug line-clamp-2 min-h-[2.5rem]">
                                {note.title}
                            </CardTitle>
                            <CardDescription className="text-[10px] md:text-xs text-zinc-500 font-medium">
                                {Formatter.toDate(note.created_at!)}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-3 pb-3 flex-grow">
                            <p className="text-[11px] md:text-sm text-zinc-400 line-clamp-2 italic leading-relaxed min-h-[3rem]">
                                "{note.description}"
                            </p>
                        </CardContent>

                        <CardFooter className="px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                                <ImageIcon className="w-3 h-3" />
                                <span>{hasImages ? `${note.image_url?.length} photos` : 'No photos'}</span>
                            </div>
                        </CardFooter>
                    </Card>
                }
                title={note.title}
                contentClassName="sm:max-w-md max-h-[90vh] overflow-y-auto"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >

                    <div className="flex flex-col gap-3 mt-4">
                        <div className="text-slate-300 text-sm mt-4 break-words leading-relaxed">
                            {note.description || "No notes available for this transaction."}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {note.image_url && note.image_url.map((url, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                                    <ImageBox src={url} alt={`Image #${index}`} />
                                </div>
                            ))}
                        </div>
                    </div>
            </CustomDialog>

            <NoteSheet onRefresh={onRefresh} existingData={note} isOpen={open} onOpenChange={setOpen} />
            <ConfirmModal title="Delete this note?" isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                description={`Are you sure you would like to delete "${note.title}"? Changes made can't be reverted.`}
            />
        </div>
    );
}