"use client";

import { Scholarship } from "@/data/scholarships";
import {
    MapPin,
    Calendar,
    GraduationCap,
    ExternalLink,
    BadgeCheck,
} from "lucide-react";

interface ScholarshipCardProps {
    scholarship: Scholarship;
}

const regionFlags: Record<string, string> = {
    US: "🇺🇸",
    UK: "🇬🇧",
    China: "🇨🇳",
    EU: "🇪🇺",
};

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
    return (
        <a
            href={scholarship.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card group block p-6 hover:border-[var(--color-primary)] transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{regionFlags[scholarship.region]}</span>
                        <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            {scholarship.country}
                        </span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--color-text)] leading-snug group-hover:text-[var(--color-primary)] transition-colors duration-200 truncate">
                        {scholarship.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                        {scholarship.institution}
                    </p>
                </div>

                {scholarship.is_fully_funded && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                        <BadgeCheck className="w-3 h-3" />
                        Funded
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-2">
                {scholarship.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-text-tertiary)] mb-4">
                <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {scholarship.deadline}
                </span>
                <span className="inline-flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {scholarship.degree_level.join(", ")}
                </span>
                <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {scholarship.country}
                </span>
            </div>

            {/* Fields Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {scholarship.fields.slice(0, 3).map((field) => (
                    <span
                        key={field}
                        className="px-2.5 py-0.5 bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] text-[11px] font-semibold rounded-full"
                    >
                        {field}
                    </span>
                ))}
                {scholarship.fields.length > 3 && (
                    <span className="px-2.5 py-0.5 bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)] text-[11px] font-semibold rounded-full">
                        +{scholarship.fields.length - 3} more
                    </span>
                )}
            </div>

            {/* Funding + Link */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                <p className="text-sm font-bold text-[var(--color-text)]">
                    {scholarship.funding}
                </p>
                <span className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ExternalLink className="w-4 h-4" />
                </span>
            </div>
        </a>
    );
}
