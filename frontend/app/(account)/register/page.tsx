"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/AuthForm";
import useRegister from "@/app/hooks/useRegister"; // Assuming default export

export default function Register() {
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { register, loading, error } = useRegister();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await register({ name, username, email, password });
        if (success)
            router.push("/login");
    };

    return (
        <AuthForm title="Create Account" subtitle="Join our platform today"
            fields={[
                {
                    id: "name",
                    label: "Full Name",
                    type: "text",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    autoComplete: "",
                    placeholder: "John Doe",
                    required: true
                },
                {
                    id: "username",
                    label: "Username",
                    type: "text",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    autoComplete: "",
                    placeholder: "johndoe",
                    required: true
                },
                {
                    id: "email",
                    label: "Email",
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    autoComplete: "",
                    placeholder: "john@example.com",
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
            submitLabel="Sign Up"
            loading={loading}
            error={error}
            footerLink={{
                text: "Already have an account?",
                linkText: "Sign in",
                href: "/login"
            }} />
    );
}