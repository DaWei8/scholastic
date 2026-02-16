"use client";

import { useState, useMemo } from "react";
import { Search, GraduationCap } from "lucide-react";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { scholarships } from "@/data/scholarships";

type Region = "All" | "US" | "UK" | "China" | "EU";

const regions: { label: string; value: Region; flag: string }[] = [
    { label: "All Regions", value: "All", flag: "🌍" },
    { label: "United States", value: "US", flag: "🇺🇸" },
    { label: "United Kingdom", value: "UK", flag: "🇬🇧" },
    { label: "China", value: "China", flag: "🇨🇳" },
    { label: "Europe", value: "EU", flag: "🇪🇺" },
];

export default function ScholarshipsTab() {
    const [activeRegion, setActiveRegion] = useState<Region>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = useMemo(() => {
        let result = scholarships;
        if (activeRegion !== "All") {
            result = result.filter((s) => s.region === activeRegion);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.title.toLowerCase().includes(q) ||
                    s.institution.toLowerCase().includes(q) ||
                    s.country.toLowerCase().includes(q) ||
                    s.fields.some((f) => f.toLowerCase().includes(q)) ||
                    s.description.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeRegion, searchQuery]);

    const counts = useMemo(() => {
        const map: Record<string, number> = { All: scholarships.length };
        for (const s of scholarships) {
            map[s.region] = (map[s.region] || 0) + 1;
        }
        return map;
    }, []);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-emerald-500" />
                    Scholarships
                </h1>
                <p className="text-base text-[var(--color-text-secondary)] mt-2">
                    Fully-funded scholarships across the US, UK, China, and Europe. Updated weekly.
                </p>
            </div>

            {/* Search bar */}
            <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                <input
                    type="text"
                    placeholder="Search by name, country, field..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
            </div>

            {/* Region tabs */}
            <div className="flex gap-2 flex-wrap">
                {regions.map((r) => (
                    <button
                        key={r.value}
                        onClick={() => setActiveRegion(r.value)}
                        className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeRegion === r.value
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                            }`}
                    >
                        {r.flag} {r.label}
                        <span className="ml-1.5 opacity-70">({counts[r.value] || 0})</span>
                    </button>
                ))}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Showing{" "}
                    <span className="font-bold text-[var(--color-text)]">{filtered.length}</span>{" "}
                    {filtered.length === 1 ? "scholarship" : "scholarships"}
                    {activeRegion !== "All" && (
                        <>
                            {" "}in{" "}
                            <span className="font-bold text-[var(--color-text)]">
                                {regions.find((r) => r.value === activeRegion)?.label}
                            </span>
                        </>
                    )}
                </p>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filtered.map((s) => (
                        <ScholarshipCard key={s.id} scholarship={s} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-[var(--color-bg-muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-[var(--color-text-tertiary)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">No scholarships found</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Try adjusting your search or selecting a different region.
                    </p>
                </div>
            )}
        </div>
    );
}
