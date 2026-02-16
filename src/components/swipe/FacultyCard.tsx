"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Faculty } from "@/types";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";

interface FacultyCardProps {
    faculty: Faculty;
    relevanceScore?: number;
    onSwipeRight: () => void;
    onSwipeLeft: () => void;
    isTopCard: boolean;
}

export default function FacultyCard({
    faculty,
    relevanceScore,
    onSwipeRight,
    onSwipeLeft,
    isTopCard,
}: FacultyCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) onSwipeRight();
        else if (info.offset.x < -100) onSwipeLeft();
    };

    return (
        <motion.div
            style={isTopCard ? { x, rotate, opacity } : {}}
            drag={isTopCard ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute w-full max-w-sm aspect-[3/4] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-zinc-100 flex flex-col"
        >
            {/* Faculty Image / Placeholder */}
            <div className="relative h-48 bg-[var(--color-primary)] flex items-center justify-center">
                {faculty.image_url ? (
                    <img src={faculty.image_url} alt={faculty.name} className="w-full h-full object-cover" />
                ) : (
                    <GraduationCap className="w-20 h-20 text-white opacity-40" />
                )}

                {relevanceScore && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-zinc-900">
                            {Math.round(relevanceScore * 100)}% Match
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{faculty.name}</h2>
                    <div className="flex items-center gap-1 text-indigo-600 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">{faculty.institution}</span>
                    </div>
                </div>

                <p className="text-zinc-600 text-sm leading-relaxed line-clamp-4 mb-6">
                    {faculty.bio_summary || "No biography available for this faculty member."}
                </p>

                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {faculty.research_interests.slice(0, 3).map((interest) => (
                            <span
                                key={interest}
                                className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full uppercase tracking-tight"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
