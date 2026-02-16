"use client";

import Link from "next/link";
import {
    Search,
    Heart,
    GraduationCap,
    TrendingUp,
    ArrowRight,
    Globe,
    Sparkles,
    Calendar,
    BookOpen,
} from "lucide-react";
import { scholarships } from "@/data/scholarships";

interface OverviewTabProps {
    matchCount: number;
    shortlistCount: number;
    userName?: string;
}

export default function OverviewTab({ matchCount, shortlistCount, userName }: OverviewTabProps) {
    const upcomingDeadlines = scholarships
        .filter((s) => s.is_fully_funded)
        .slice(0, 3);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Greeting */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                    {greeting()}{userName ? `, ${userName}` : ""} 👋
                </h1>
                <p className="text-base text-[var(--color-text-secondary)] mt-2">
                    Here&apos;s what&apos;s happening with your research journey.
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Search className="w-5 h-5" />}
                    label="Matches Found"
                    value={matchCount}
                    color="#2563EB"
                    href="/dashboard/discover"
                />
                <StatCard
                    icon={<Heart className="w-5 h-5" />}
                    label="Shortlisted"
                    value={shortlistCount}
                    color="#EC4899"
                    href="/dashboard/shortlist"
                />
                <StatCard
                    icon={<GraduationCap className="w-5 h-5" />}
                    label="Scholarships"
                    value={scholarships.length}
                    color="#10B981"
                    href="/dashboard/scholarships"
                />
                <StatCard
                    icon={<Globe className="w-5 h-5" />}
                    label="Regions Covered"
                    value={4}
                    color="#F59E0B"
                />
            </div>

            {/* Quick actions + upcoming deadlines grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick actions */}
                <div className="card-static rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                        Quick Actions
                    </h2>

                    <div className="space-y-3">
                        <QuickActionItem
                            icon={<Search className="w-4 h-4" />}
                            title="Find Supervisors"
                            description="Use AI agents to discover faculty matching your research"
                            color="#2563EB"
                            href="/dashboard/discover"
                        />
                        <QuickActionItem
                            icon={<GraduationCap className="w-4 h-4" />}
                            title="Browse Scholarships"
                            description="Explore fully-funded programs in US, UK, China & Europe"
                            color="#10B981"
                            href="/dashboard/scholarships"
                        />
                        <QuickActionItem
                            icon={<Heart className="w-4 h-4" />}
                            title="View Shortlist"
                            description="Review and reach out to your saved matches"
                            color="#EC4899"
                            href="/dashboard/shortlist"
                        />
                    </div>
                </div>

                {/* Upcoming deadlines */}
                <div className="card-static rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                            Upcoming Deadlines
                        </h2>
                        <Link
                            href="/dashboard/scholarships"
                            className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {upcomingDeadlines.map((s) => (
                            <a
                                key={s.id}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-muted)] transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                                        {s.title}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                                        {s.institution} · {s.deadline}
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">
                                    {s.funding.split(" ")[0]}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* How it works banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-700 p-8 md:p-10">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-blue-200" />
                            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                                AI-Powered Matching
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                            Let our AI agents find your perfect supervisor
                        </h3>
                        <p className="text-sm text-blue-100 mt-2 max-w-lg leading-relaxed">
                            Our 4-agent pipeline analyzes your profile, crawls university websites,
                            extracts faculty data, and ranks matches by relevance — all in real time.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/discover"
                        className="h-12 px-8 bg-white text-[var(--color-primary)] text-sm font-bold rounded-full flex items-center gap-2 hover:bg-blue-50 transition-colors flex-shrink-0"
                    >
                        Start Discovery
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ─── Helper Components ─────────────────────────── */

function StatCard({
    icon,
    label,
    value,
    color,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    href?: string;
}) {
    const content = (
        <>
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                style={{ background: `${color}12`, color }}
            >
                {icon}
            </div>
            <p className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight">
                {value}
            </p>
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mt-0.5">
                {label}
            </p>
        </>
    );

    if (href) {
        return (
            <Link href={href} className="card-static rounded-2xl p-5 text-left hover:shadow-md transition-all group block">
                {content}
            </Link>
        );
    }

    return (
        <div className="card-static rounded-2xl p-5 text-left">
            {content}
        </div>
    );
}

function QuickActionItem({
    icon,
    title,
    description,
    color,
    href,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-[var(--color-bg-muted)] transition-all text-left group"
        >
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: `${color}12`, color }}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {title}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 truncate">
                    {description}
                </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0" />
        </Link>
    );
}
