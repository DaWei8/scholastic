"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMobileHeader from "@/components/dashboard/DashboardMobileHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [authLoading, user, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-[var(--color-bg-subtle)]">
            {/* Desktop sidebar */}
            <DashboardSidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile header */}
                <DashboardMobileHeader />

                {/* Page content */}
                <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
