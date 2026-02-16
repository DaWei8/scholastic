"use client";

import { useState, useCallback } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import AgentPipeline from "@/components/discovery/AgentPipeline";
import {
    ArrowLeft,
    ExternalLink,
    MapPin,
    Sparkles,
    Mail,
    ChevronDown,
    ChevronUp,
    Search,
} from "lucide-react";

interface AgentStep {
    id: string;
    label: string;
    status: "pending" | "running" | "done" | "error";
    detail?: string;
    data?: Record<string, unknown>;
    substeps?: { label: string; status: "pending" | "running" | "done" | "error" }[];
}

interface FacultyMatch {
    name: string;
    institution: string;
    department: string;
    email: string;
    bio_summary: string;
    research_interests: string[];
    website_url: string;
    relevance_score: number;
    match_reason: string;
}

interface DiscoverTabProps {
    userEmail: string;
    onMatchCountChange?: (count: number) => void;
}

export default function DiscoverTab({ userEmail, onMatchCountChange }: DiscoverTabProps) {
    const [matches, setMatches] = useState<FacultyMatch[] | null>(null);
    const [pipelineRunning, setPipelineRunning] = useState(false);
    const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
    const [pipelineError, setPipelineError] = useState<string | null>(null);
    const [showPipeline, setShowPipeline] = useState(true);

    const handleFindMatches = useCallback(async (profileText: string) => {
        setPipelineRunning(true);
        setPipelineError(null);
        setMatches(null);
        setAgentSteps([]);
        setShowPipeline(true);

        try {
            const response = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileText, targetCountries: [] }),
            });

            if (!response.ok) throw new Error("Failed to start pipeline");
            if (!response.body) throw new Error("No response stream");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                let eventType = "";
                for (const line of lines) {
                    if (line.startsWith("event: ")) {
                        eventType = line.slice(7).trim();
                    } else if (line.startsWith("data: ") && eventType) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (eventType === "step") {
                                setAgentSteps((prev) => {
                                    const existing = prev.findIndex((s) => s.id === data.id);
                                    if (existing >= 0) {
                                        const updated = [...prev];
                                        updated[existing] = data;
                                        return updated;
                                    }
                                    return [...prev, data];
                                });
                            } else if (eventType === "result") {
                                const m = data.matches || [];
                                setMatches(m);
                                onMatchCountChange?.(m.length);
                            } else if (eventType === "error") {
                                setPipelineError(data.message);
                            }
                        } catch {
                            // skip malformed
                        }
                        eventType = "";
                    }
                }
            }
        } catch (err) {
            console.error("Pipeline error:", err);
            setPipelineError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setPipelineRunning(false);
        }
    }, [onMatchCountChange]);

    const handleProfileComplete = () => { };

    const resetSearch = () => {
        setMatches(null);
        setAgentSteps([]);
        setPipelineError(null);
        setShowPipeline(true);
    };

    const hasResults = matches !== null && matches.length > 0;
    const showingPipeline = pipelineRunning || agentSteps.length > 0;

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight flex items-center gap-3">
                    <Search className="w-8 h-8 text-[var(--color-primary)]" />
                    Discover Supervisors
                </h1>
                <p className="text-base text-[var(--color-text-secondary)] mt-2">
                    Build your profile and let our AI agents find the best faculty matches for you.
                </p>
            </div>

            {/* Phase 1: Profile form */}
            {!showingPipeline && !hasResults && (
                <ProfileForm
                    userEmail={userEmail}
                    onComplete={handleProfileComplete}
                    onFindMatches={handleFindMatches}
                    loading={pipelineRunning}
                />
            )}

            {/* Phase 2: Pipeline */}
            {showingPipeline && (
                <div className="space-y-8">
                    <AgentPipeline steps={agentSteps} isRunning={pipelineRunning} />
                    {pipelineError && (
                        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
                            {pipelineError}
                        </div>
                    )}
                </div>
            )}

            {/* Phase 3: Results */}
            {hasResults && (
                <div className="space-y-6">
                    {agentSteps.length > 0 && (
                        <button
                            onClick={() => setShowPipeline(!showPipeline)}
                            className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                        >
                            {showPipeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {showPipeline ? "Hide agent details" : "Show agent details"}
                        </button>
                    )}

                    <div className="flex items-center justify-between">
                        <button
                            onClick={resetSearch}
                            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            New Search
                        </button>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-[var(--color-text)]">
                                {matches.length} {matches.length === 1 ? "Match" : "Matches"} Found
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Ranked by relevance to your profile
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {matches.map((faculty, index) => (
                            <FacultyMatchCard key={`${faculty.name}-${index}`} faculty={faculty} rank={index + 1} />
                        ))}
                    </div>
                </div>
            )}

            {/* No results */}
            {matches !== null && matches.length === 0 && !pipelineRunning && (
                <div className="text-center py-16 space-y-4">
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        No matches found. Try adjusting your profile.
                    </p>
                    <button onClick={resetSearch} className="h-11 px-6 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── Faculty Match Card ───────────────────────── */

function FacultyMatchCard({ faculty, rank }: { faculty: FacultyMatch; rank: number }) {
    const [expanded, setExpanded] = useState(false);
    const scorePercent = Math.round(faculty.relevance_score * 100);

    const scoreColor =
        scorePercent >= 80 ? "#10B981" : scorePercent >= 60 ? "#3B82F6" : scorePercent >= 40 ? "#F59E0B" : "#EF4444";

    return (
        <div className="card-static rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-up" style={{ animationDelay: `${rank * 80}ms` }}>
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ background: rank <= 3 ? `${scoreColor}15` : "var(--color-bg-muted)", color: rank <= 3 ? scoreColor : "var(--color-text-tertiary)" }}
                    >
                        #{rank}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-[var(--color-text)] truncate">{faculty.name}</h3>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: `${scoreColor}15`, color: scoreColor }}>
                                <Sparkles className="w-3 h-3" />
                                {scorePercent}% match
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[var(--color-text-secondary)]">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{faculty.institution} · {faculty.department}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 ml-14">
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{faculty.match_reason}</p>
                </div>

                <div className="mt-3 ml-14 flex flex-wrap gap-1.5">
                    {faculty.research_interests.slice(0, 5).map((interest) => (
                        <span key={interest} className="text-[10px] font-bold bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] px-2.5 py-1 rounded-full uppercase tracking-tight">
                            {interest}
                        </span>
                    ))}
                </div>

                <button onClick={() => setExpanded(!expanded)} className="mt-3 ml-14 flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline transition-colors">
                    {expanded ? "Less details" : "More details"}
                    {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {expanded && (
                    <div className="mt-4 ml-14 space-y-3 animate-fade-in">
                        <div className="p-4 rounded-xl bg-[var(--color-bg-subtle)] space-y-3">
                            <p className="text-sm text-[var(--color-text)] leading-relaxed">{faculty.bio_summary}</p>
                            <div className="flex flex-wrap gap-3">
                                {faculty.email && (
                                    <a href={`mailto:${faculty.email}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline">
                                        <Mail className="w-3.5 h-3.5" /> {faculty.email}
                                    </a>
                                )}
                                {faculty.website_url && (
                                    <a href={faculty.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline">
                                        <ExternalLink className="w-3.5 h-3.5" /> Faculty Page
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
