"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import FacultyCard from "./FacultyCard";
import { Faculty } from "@/types";
import { useSwipe } from "@/hooks/useSwipe";

interface SwipeDeckProps {
    faculties: (Faculty & { similarity?: number })[];
    userId: string;
}

export default function SwipeDeck({ faculties: initialFaculties, userId }: SwipeDeckProps) {
    const [faculties, setFaculties] = useState(initialFaculties);
    const { handleSwipe } = useSwipe();

    const handleSwipeComplete = async (facultyId: string, status: "shortlisted" | "rejected") => {
        const faculty = faculties.find((f) => f.id === facultyId);
        if (!faculty) return;

        // Proactively update UI
        setFaculties((prev) => prev.filter((f) => f.id !== facultyId));

        // 1. Update Interaction in Supabase
        await handleSwipe(userId, facultyId, status, faculty.similarity);

        // 2. If shortlisted, generate outreach draft in the background
        if (status === "shortlisted") {
            try {
                // We pass the resumeText from the current search context if available
                // For now, we assume it's stored or we pass it via props
                // This is an optimization to avoid refetching
                fetch("/api/outreach/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        facultyId,
                        resumeText: localStorage.getItem("lastResumeText") || ""
                    }),
                });
            } catch (err) {
                console.error("Failed to trigger outreach generation:", err);
            }
        }
    };

    return (
        <div className="relative w-full max-w-sm h-[600px] mx-auto mt-10">
            <AnimatePresence>
                {faculties.map((faculty, index) => (
                    <div
                        key={faculty.id}
                        className="absolute inset-0"
                        style={{ zIndex: faculties.length - index }}
                    >
                        <FacultyCard
                            faculty={faculty}
                            relevanceScore={faculty.similarity}
                            isTopCard={index === 0}
                            onSwipeRight={() => handleSwipeComplete(faculty.id, "shortlisted")}
                            onSwipeLeft={() => handleSwipeComplete(faculty.id, "rejected")}
                        />
                    </div>
                ))}
            </AnimatePresence>

            {faculties.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                    <p className="text-zinc-500 font-medium italic">
                        You've seen all matches. Check back later for more!
                    </p>
                </div>
            )}
        </div>
    );
}
