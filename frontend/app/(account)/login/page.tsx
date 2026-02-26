"use client"

import { useState } from "react";
import { useLogin } from "@/app/hooks";
import { useRouter } from "next/navigation";

import AuthForm from "@/app/components/AuthForm";

export default function Login() {
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { login, loading, error } = useLogin();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login({ identifier, password });
        if (success)
            router.push("/");
    };

    return (
        <AuthForm title="Welcome Back" subtitle="Sign in to your account"
            fields={[
                {
                    id: "identifier",
                    label: "Username or Email",
                    type: "text",
                    value: identifier,
                    onChange: (e) => setIdentifier(e.target.value),
                    autoComplete: "",
                    placeholder: "user@example.com",
                    required: true
                },
                {
                    id: "password",
                    label: "Password",
                    type: "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    autoComplete: "current-password",
                    placeholder: "••••••••",
                    required: true
                }
            ]}
            onSubmit={handleSubmit}
            submitLabel="Sign In"
            loading={loading}
            error={error}
            footerLink={{
                text: "Don't have an account?",
                linkText: "Sign up",
                href: "/register"
            }} />
    );
}