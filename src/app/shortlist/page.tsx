"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Interaction, Faculty, OutreachLog } from "@/types";
import { Mail, GraduationCap, MapPin, Sparkles, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ShortlistedFaculty extends Faculty {
    interactions: {
        id: string;
        match_explanation: string;
        outreach_logs: OutreachLog[];
    }[];
}

export default function ShortlistPage() {
    const [shortlisted, setShortlisted] = useState<ShortlistedFaculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId] = useState("test-user-123"); // Mock user ID

    useEffect(() => {
        async function fetchShortlist() {
            setLoading(true);
            try {
                // Fetch interactions with faculty and outreach logs
                const { data, error } = await supabase
                    .from('faculty')
                    .select(`
                        *,
                        interactions!inner (
                            id,
                            match_explanation,
                            status,
                            outreach_logs (*)
                        )
                    `)
                    .eq('interactions.user_id', userId)
                    .eq('interactions.status', 'shortlisted');

                if (error) throw error;
                setShortlisted(data as any);
            } catch (err) {
                console.error("Error fetching shortlist:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchShortlist();
    }, [userId]);

    return (
        <main className="min-h-screen bg-zinc-50 py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Your Shortlist</h1>
                        <p className="text-zinc-500 mt-2">Manage your potential research matches and outreach.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-white border border-zinc-200 rounded-2xl font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
                    >
                        Back to Discovery
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-zinc-500 font-medium">Loading your matches...</p>
                    </div>
                ) : shortlisted.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-zinc-100 shadow-xl space-y-6">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                            <GraduationCap className="w-10 h-10 text-indigo-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-zinc-900">No shortlists yet</h2>
                            <p className="text-zinc-500 max-w-sm mx-auto">
                                Swipe right on faculty members in the discovery deck to add them to your shortlist.
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                        >
                            Start Discovering
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {shortlisted.map((faculty) => {
                            const interaction = faculty.interactions[0];
                            const outreach = interaction?.outreach_logs?.[0];

                            return (
                                <div
                                    key={faculty.id}
                                    className="bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
                                >
                                    <div className="p-8 flex flex-col md:flex-row gap-8">
                                        {/* Left Side: Faculty Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                                                        {faculty.name}
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-zinc-500 mt-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="font-semibold">{faculty.institution}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                                                    Match Confirmed
                                                </div>
                                            </div>

                                            {interaction?.match_explanation && (
                                                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3">
                                                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-zinc-700 leading-relaxed italic">
                                                        "{interaction.match_explanation}"
                                                    </p>
                                                </div>
                                            )}

                                            <div className="pt-4 flex flex-wrap gap-2">
                                                {faculty.research_interests.map(interest => (
                                                    <span key={interest} className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium">
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Side: Outreach Action */}
                                        <div className="w-full md:w-80 space-y-4">
                                            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                                                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-indigo-600" />
                                                    Outreach Status
                                                </h3>

                                                {outreach ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Draft ready for review
                                                        </div>
                                                        <button
                                                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                                            onClick={() => alert(`Reviewing draft for ${faculty.name}:\n\n${outreach.email_body}`)}
                                                        >
                                                            Review & Send <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 text-zinc-400 font-medium text-sm">
                                                            <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
                                                            Generating AI draft...
                                                        </div>
                                                        <button disabled className="w-full py-3 bg-zinc-200 text-zinc-400 rounded-xl font-bold text-sm cursor-not-allowed">
                                                            Generating...
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <Link
                                                href={faculty.website_url || "#"}
                                                target="_blank"
                                                className="block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                            >
                                                View Faculty Website
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
