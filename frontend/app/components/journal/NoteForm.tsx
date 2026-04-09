"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Trash2 } from "lucide-react";

import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { JournalInfo } from "@/app/types/user/JournalInfo";

interface NoteFormProps {
    existingData?: JournalInfo;
    loading: boolean;
    onSubmit: (data: JournalInfo) => Promise<void>;
}

export default function NoteForm({ existingData, loading, onSubmit }: NoteFormProps) {
    const [data, setData] = useState<JournalInfo>(existingData || {
        title: "",
        description: "",
        category: "",
        image_url: []
    });

    const handleChangeData = (key: keyof JournalInfo, value: any) => {
        setData((prev) => ({ ...prev, [key]: typeof value === "function" ? value(prev[key as keyof JournalInfo]) : value }));
    }

    const handleRemoveImage = (id: number) => {
        handleChangeData('image_url', (prev: string[]) => prev.filter((_, i) => i !== id));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(data)
        }} className="space-y-6 mt-6">
            <div className="space-y-2 mx-5">
                <Label htmlFor="title" className="text-zinc-200">Title</Label>
                <Input disabled={loading}
                    id="title"
                    placeholder="e.g. BTC/USDT Setup"
                    value={data.title}
                    onChange={(e) => handleChangeData('title', e.target.value)}
                    required
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500"
                />
            </div>
            <div className="space-y-2 mx-5">
                <Label htmlFor="description" className="text-zinc-200">Description</Label>
                <Textarea disabled={loading}
                    id="description"
                    placeholder="What did you learn from this trade?"
                    value={data.description}
                    onChange={(e) => handleChangeData('description', e.target.value)}
                    required
                    className="whitespace-pre-line min-h-[120px] bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500"
                />
            </div>
            <div className="space-y-2 mx-5">
                <Label htmlFor="category" className="text-zinc-200">Category</Label>
                <Input disabled={loading}
                    id="category"
                    placeholder="The category"
                    value={data.category}
                    onChange={(e) => handleChangeData('category', e.target.value)}
                    required
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500"
                />
            </div>
            <div className="space-y-2 mx-5">
                <Label htmlFor="image" className="text-zinc-200">Image (Optional)</Label>
                <CldUploadWidget
                    uploadPreset="first-preset-test"
                    options={{
                        multiple: true,
                        maxFiles: 5,
                        sources: ['local', 'camera', 'url'],
                        clientAllowedFormats: ['png', 'jpg', 'jpeg']
                    }}
                    onSuccess={(result) => {
                        if (typeof result.info !== 'string' && result.info) {
                            const url = result.info?.secure_url;
                            handleChangeData('image_url', (prev: string[]) => {
                                const arr = Array.from(prev) ? prev : [];
                                return [...arr, url];
                            });
                        }
                    }}
                >
                    {({ open }) => (
                        <Button disabled={loading}
                            type="button"
                            variant="outline"
                            onClick={() => open()}
                            className="w-full border-dashed border-white/10 bg-zinc-900"
                        >
                            Upload Images ({data.image_url.length})
                        </Button>
                    )}
                </CldUploadWidget>
                {data.image_url && data.image_url.map((img, i) => (
                    <div className="relative mt-4 rounded-md overflow-hidden border border-white/10 group">
                        <Image key={i} src={img} alt="Preview" width={500} height={300} className="object-cover w-full h-auto" />
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-[10px] text-white rounded">
                            Image #{i + 1}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mx-5">
                <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                    Save Journal
                </Button>
            </div>
        </form>
    )
}