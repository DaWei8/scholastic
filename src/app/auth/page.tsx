"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Mode = "signin" | "signup";

export default function AuthPage() {
    const [mode, setMode] = useState<Mode>("signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const router = useRouter();
    const { signUp, signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        if (mode === "signup") {
            const { error } = await signUp(email, password);
            if (error) {
                setError(error);
            } else {
                setCheckEmail(true);
            }
        } else {
            const { error } = await signIn(email, password);
            if (error) {
                setError(error);
            } else {
                router.push("/dashboard");
            }
        }

        setLoading(false);
    };

    if (checkEmail) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-2xl flex items-center justify-center mx-auto">
                        <Mail className="w-7 h-7 text-[var(--color-primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">
                        Check your email
                    </h1>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        We sent a confirmation link to{" "}
                        <span className="font-semibold text-[var(--color-text)]">
                            {email}
                        </span>
                        . Click the link to activate your account, then come back and sign
                        in.
                    </p>
                    <button
                        onClick={() => {
                            setCheckEmail(false);
                            setMode("signin");
                        }}
                        className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
                    >
                        Back to sign in
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text)] tracking-tight">
                            ScholarConnect
                        </span>
                    </Link>
                    <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-xs">
                        {mode === "signup"
                            ? "Create an account to save your profile, matches, and scholarships."
                            : "Welcome back. Sign in to continue."}
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="card-static rounded-2xl p-8 space-y-5"
                >
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="text-sm font-semibold text-[var(--color-text)]"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@university.edu"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-[var(--color-text)]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {mode === "signup" ? "Create Account" : "Sign In"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <p className="text-center text-sm text-[var(--color-text-secondary)]">
                    {mode === "signup" ? (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => {
                                    setMode("signin");
                                    setError(null);
                                }}
                                className="font-semibold text-[var(--color-primary)] hover:underline"
                            >
                                Sign in
                            </button>
                        </>
                    ) : (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => {
                                    setMode("signup");
                                    setError(null);
                                }}
                                className="font-semibold text-[var(--color-primary)] hover:underline"
                            >
                                Create one
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
