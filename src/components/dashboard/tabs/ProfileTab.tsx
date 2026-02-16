"use client";

import { User, Mail, GraduationCap, Shield, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileTab() {
    const { user } = useAuth();

    const fields = [
        { icon: <Mail className="w-4 h-4" />, label: "Email", value: user?.email || "—" },
        {
            icon: <GraduationCap className="w-4 h-4" />,
            label: "Account Created",
            value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—",
        },
        { icon: <Shield className="w-4 h-4" />, label: "Plan", value: "Free" },
    ];

    return (
        <div className="space-y-8 animate-fade-up max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight flex items-center gap-3">
                    <User className="w-8 h-8 text-[var(--color-primary)]" />
                    Profile
                </h1>
                <p className="text-base text-[var(--color-text-secondary)] mt-2">
                    Your account details and preferences.
                </p>
            </div>

            {/* Avatar + name card */}
            <div className="card-static rounded-2xl p-8 flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-extrabold text-white">
                        {user?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-text)]">
                        {user?.email?.split("@")[0] || "User"}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                        {user?.email || "No email"}
                    </p>
                    <span className="inline-flex mt-2 items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        Active
                    </span>
                </div>
            </div>

            {/* Account details */}
            <div className="card-static rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-[var(--color-border-light)]">
                    <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                        Account Details
                    </h3>
                </div>
                <div className="divide-y divide-[var(--color-border-light)]">
                    {fields.map((field) => (
                        <div key={field.label} className="flex items-center gap-4 px-5 py-4">
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-muted)] flex items-center justify-center text-[var(--color-text-tertiary)]">
                                {field.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                                    {field.label}
                                </p>
                                <p className="text-sm font-medium text-[var(--color-text)] mt-0.5">
                                    {field.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger zone */}
            <div className="card-static rounded-2xl p-6 border-red-100 space-y-4">
                <h3 className="font-bold text-red-600 text-sm">Danger Zone</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Deleting your account will permanently remove all your data, matches, and saved scholarships.
                </p>
                <button className="h-10 px-5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
