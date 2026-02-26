import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Field {
    id: string;
    label: string;
    type: string;
    autoComplete: string;
    value: string;
    placeholder: string;
    required?: boolean;

    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FooterLink {
    text: string;
    linkText: string;
    href: string;
}

interface AuthFormProps {
    title: string;
    subtitle: string;
    fields: Field[];
    submitLabel: string;
    loading: boolean;
    error: string | null;
    footerLink?: FooterLink;

    onSubmit: (e: React.FormEvent) => void;
}

export default function AuthForm({ title, subtitle, fields, submitLabel, loading, error, footerLink, onSubmit }: AuthFormProps) {
    const [showPassword, setShowPassword] = React.useState<Record<string, boolean>>({});

    const togglePassword = (id: string) => {
        setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <Card className="w-full max-w-md border-white/10 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">{subtitle}</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        {fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id} className="text-sm font-medium text-gray-300">
                                    {field.label}
                                </Label>
                                <div className="relative group">
                                    <Input autoComplete={field.autoComplete} id={field.id} type={field.type === "password" && showPassword[field.id] ? "text" : field.type} value={field.value} onChange={field.onChange}
                                        className="w-full rounded-xl bg-gray-900/50 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder={field.placeholder}
                                        required={field.required} />

                                    {field.type === "password" && (
                                        <button type="button" onClick={() => togglePassword(field.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors px-1">
                                            <i className={`fa-solid ${showPassword[field.id] ? 'fa-eye' : 'fa-eye-slash'} text-sm`}></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <Button size="lg" type="submit" disabled={loading} variant="gradient" className="mt-2">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                    Processing...
                                </span>
                            ) : (
                                submitLabel
                            )}
                        </Button>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                {error}
                            </div>
                        )}

                        {footerLink && (
                            <div className="text-center text-sm text-gray-500">
                                {footerLink.text}
                                <a href={footerLink.href} className="px-1 text-blue-400 hover:text-blue-300 transition-colors">
                                    {footerLink.linkText}
                                </a>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>


        </div>
    );
}
