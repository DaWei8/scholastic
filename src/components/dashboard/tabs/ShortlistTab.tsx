"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Faculty, OutreachLog } from "@/types";
import {
    Mail,
    Heart,
    MapPin,
    Sparkles,
    ChevronRight,
    CheckCircle2,
    ExternalLink,
    Inbox,
    Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ShortlistedFaculty extends Faculty {
    interactions: {
        id: string;
        match_explanation: string;
        outreach_logs: OutreachLog[];
    }[];
}

export default function ShortlistTab() {
    const [shortlisted, setShortlisted] = useState<ShortlistedFaculty[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchShortlist() {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("faculty")
                    .select(`
                        *,
                        interactions!inner (
                            id,
                            match_explanation,
                            status,
                            outreach_logs (*)
                        )
                    `)
                    .eq("interactions.user_id", user.id)
                    .eq("interactions.status", "shortlisted");

                if (error) throw error;
                setShortlisted(data as ShortlistedFaculty[]);
            } catch (err) {
                console.error("Error fetching shortlist:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchShortlist();
    }, [user]);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight flex items-center gap-3">
                    <Heart className="w-8 h-8 text-pink-500" />
                    Your Shortlist
                </h1>
                <p className="text-base text-[var(--color-text-secondary)] mt-2">
                    Manage your saved matches and generate outreach emails.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--color-text-secondary)] font-medium">Loading your matches...</p>
                </div>
            ) : shortlisted.length === 0 ? (
                <div className="card-static rounded-2xl p-16 text-center space-y-6">
                    <div className="w-20 h-20 bg-[var(--color-primary-light)] rounded-2xl flex items-center justify-center mx-auto">
                        <Inbox className="w-10 h-10 text-[var(--color-primary)]" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-[var(--color-text)]">No matches saved yet</h2>
                        <p className="text-[var(--color-text-secondary)] max-w-sm mx-auto">
                            Start discovering supervisors and save the ones you want to reach out to.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/discover"
                        className="inline-flex items-center gap-2 h-12 px-8 bg-[var(--color-primary)] text-white rounded-full font-bold text-sm hover:bg-[var(--color-primary-hover)] transition-all"
                    >
                        <Search className="w-4 h-4" />
                        Start Discovering
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {shortlisted.map((faculty) => {
                        const interaction = faculty.interactions[0];
                        const outreach = interaction?.outreach_logs?.[0];

                        return (
                            <div
                                key={faculty.id}
                                className="card-static rounded-2xl overflow-hidden transition-all hover:shadow-md"
                            >
                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                    {/* Faculty info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-[var(--color-text)]">
                                                    {faculty.name}
                                                </h2>
                                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mt-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{faculty.institution}</span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                                                <Heart className="w-3 h-3" />
                                                Saved
                                            </span>
                                        </div>

                                        {interaction?.match_explanation && (
                                            <div className="bg-[var(--color-primary-light)] p-4 rounded-xl border border-[var(--color-primary-muted)] flex gap-3">
                                                <Sparkles className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed italic">
                                                    &quot;{interaction.match_explanation}&quot;
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {faculty.research_interests.map((interest) => (
                                                <span
                                                    key={interest}
                                                    className="px-3 py-1 bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] rounded-full text-xs font-semibold"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Outreach panel */}
                                    <div className="w-full md:w-72 space-y-4">
                                        <div className="p-5 bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border-light)] space-y-4">
                                            <h3 className="font-bold text-[var(--color-text)] flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                                                Outreach Status
                                            </h3>

                                            {outreach ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Draft ready
                                                    </div>
                                                    <button
                                                        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] transition-all"
                                                        onClick={() =>
                                                            alert(`Reviewing draft for ${faculty.name}:\n\n${outreach.email_body}`)
                                                        }
                                                    >
                                                        Review & Send <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-[var(--color-text-tertiary)] font-medium text-sm">
                                                        <div className="w-4 h-4 border-2 border-[var(--color-border)] border-t-[var(--color-text-tertiary)] rounded-full animate-spin" />
                                                        Generating AI draft...
                                                    </div>
                                                    <button
                                                        disabled
                                                        className="w-full py-3 bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)] rounded-xl font-bold text-sm cursor-not-allowed"
                                                    >
                                                        Generating...
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {faculty.website_url && (
                                            <a
                                                href={faculty.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View Faculty Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
