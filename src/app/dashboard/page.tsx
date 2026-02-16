"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import ProfileForm from "@/components/profile/ProfileForm";
import { Faculty } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, LogOut } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

export default function DashboardPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [matches, setMatches] = useState<
        (Faculty & { similarity: number })[] | null
    >(null);
    const [matchLoading, setMatchLoading] = useState(false);

    // Redirect to auth if not signed in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [authLoading, user, router]);

    const handleFindMatches = async (profileText: string) => {
        setMatchLoading(true);
        try {
            const response = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText: profileText }),
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || "Failed to find matches");
            }
            localStorage.setItem("lastResumeText", profileText);
            setMatches(data.matches);
        } catch (err) {
            console.error("Match error:", err);
        } finally {
            setMatchLoading(false);
        }
    };

    const handleProfileComplete = (data: any) => {
        // Profile data can be saved to Supabase profiles table here
        console.log("Profile completed:", data);
    };

    const resetSearch = () => {
        setMatches(null);
    };

    // Show nothing while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render if not authed (redirect will fire)
    if (!user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-bg-subtle)]">
            <Navbar
                ctaLabel="Sign Out"
                ctaHref="#"
            />

            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {!matches ? (
                        <div className="space-y-10">
                            {/* Header */}
                            <div className="text-center space-y-3">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                                    Build your profile
                                </h1>
                                <p className="text-base text-[var(--color-text-secondary)] max-w-lg mx-auto">
                                    Tell us about your research background, interests, and
                                    preferences. We'll use this to find the best supervisors and
                                    scholarships for you.
                                </p>
                            </div>

                            {/* Multi-step form */}
                            <ProfileForm
                                userEmail={user.email || ""}
                                onComplete={handleProfileComplete}
                                onFindMatches={handleFindMatches}
                                loading={matchLoading}
                            />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={resetSearch}
                                    className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium transition-colors text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Edit Profile
                                </button>

                                <div className="text-right">
                                    <h2 className="text-2xl font-bold text-[var(--color-text)]">
                                        {matches.length} Matches Found
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Sorted by best fit
                                    </p>
                                </div>
                            </div>

                            <SwipeDeck
                                faculties={matches}
                                userId={user.id}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
