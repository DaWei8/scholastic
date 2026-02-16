"use client";

import { useState } from "react";
import { Search, FileText, AlertCircle } from "lucide-react";
import { Faculty } from "@/types";

interface ResumeUploadProps {
    onMatchesFound: (matches: (Faculty & { similarity: number })[]) => void;
}

export default function ResumeUpload({ onMatchesFound }: ResumeUploadProps) {
    const [resumeText, setResumeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!resumeText.trim()) {
            setError("Please paste your resume text first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to find matches");
            }

            // Save for outreach generation later
            localStorage.setItem("lastResumeText", resumeText);

            onMatchesFound(data.matches);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-zinc-100 space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    How would you describe your research?
                </h2>
                <p className="text-zinc-500">
                    Paste your resume, a bio, or a summary of your research interests.
                    We&apos;ll use this to find the best matches for you.
                </p>
            </div>

            <div className="relative">
                <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="E.g. I am a graduate student interested in Reinforcement Learning and its applications in robotic control..."
                    className="w-full h-48 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-zinc-800 placeholder:text-zinc-400"
                />

                {error && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-rose-500 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing and Matching...
                    </>
                ) : (
                    <>
                        <Search className="w-5 h-5" />
                        Find My Faculty Matches
                    </>
                )}
            </button>
        </div>
    );
}
