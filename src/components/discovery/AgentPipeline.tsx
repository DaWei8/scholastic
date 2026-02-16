"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Brain,
    Globe,
    FileSearch,
    BarChart3,
    CheckCircle2,
    Loader2,
    Circle,
    AlertCircle,
    Sparkles,
} from "lucide-react";

interface Substep {
    label: string;
    status: "pending" | "running" | "done" | "error";
}

interface AgentStep {
    id: string;
    label: string;
    status: "pending" | "running" | "done" | "error";
    detail?: string;
    data?: Record<string, unknown>;
    substeps?: Substep[];
}

const STEP_ICONS: Record<string, React.ElementType> = {
    "query-planner": Brain,
    "web-crawler": Globe,
    extractor: FileSearch,
    ranker: BarChart3,
};

const STEP_COLORS: Record<string, string> = {
    "query-planner": "#8B5CF6",
    "web-crawler": "#3B82F6",
    extractor: "#10B981",
    ranker: "#F59E0B",
};

interface AgentPipelineProps {
    steps: AgentStep[];
    isRunning: boolean;
}

export default function AgentPipeline({ steps, isRunning }: AgentPipelineProps) {
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

    const toggleStep = (stepId: string) => {
        setExpandedSteps((prev) => {
            const next = new Set(prev);
            if (next.has(stepId)) next.delete(stepId);
            else next.add(stepId);
            return next;
        });
    };

    const defaultSteps: AgentStep[] = [
        { id: "query-planner", label: "Analyzing your profile", status: "pending" },
        { id: "web-crawler", label: "Searching university websites", status: "pending" },
        { id: "extractor", label: "Extracting faculty information", status: "pending" },
        { id: "ranker", label: "Ranking matches by relevance", status: "pending" },
    ];

    // Merge incoming steps with defaults
    const mergedSteps = defaultSteps.map((def) => {
        const incoming = steps.find((s) => s.id === def.id);
        return incoming || def;
    });

    const completedCount = mergedSteps.filter((s) => s.status === "done").length;
    const progress = mergedSteps.length > 0 ? (completedCount / mergedSteps.length) * 100 : 0;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-semibold">
                    <Sparkles className="w-4 h-4" />
                    AI Agent Pipeline
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">
                    {isRunning ? "Finding your matches..." : completedCount === mergedSteps.length ? "Search Complete!" : "Ready to search"}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                    {isRunning
                        ? "Our AI agents are working together to find the best faculty matches for you."
                        : completedCount === mergedSteps.length
                            ? "All agents have completed their tasks."
                            : "Click 'Find My Matches' to start the multi-agent search."}
                </p>
            </div>

            {/* Progress bar */}
            {(isRunning || completedCount > 0) && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-secondary)]">
                        <span>{completedCount} of {mergedSteps.length} agents completed</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-bg-muted)] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #8B5CF6, #3B82F6, #10B981, #F59E0B)",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Steps cascade */}
            <div className="space-y-3">
                {mergedSteps.map((step, index) => {
                    const Icon = STEP_ICONS[step.id] || Circle;
                    const color = STEP_COLORS[step.id] || "#6B7280";
                    const isExpanded = expandedSteps.has(step.id);
                    const hasDetails = step.detail || (step.substeps && step.substeps.length > 0) || step.data;

                    return (
                        <div
                            key={step.id}
                            className="animate-fade-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${step.status === "running"
                                    ? "border-[var(--color-primary)] shadow-md"
                                    : step.status === "done"
                                        ? "border-[var(--color-border)]"
                                        : step.status === "error"
                                            ? "border-red-300"
                                            : "border-[var(--color-border-light)]"
                                    }`}
                                style={{
                                    background: step.status === "running"
                                        ? `linear-gradient(135deg, ${color}08, ${color}03)`
                                        : "var(--color-bg)",
                                    opacity: step.status === "pending" ? 0.5 : 1,
                                }}
                            >
                                {/* Step header — clickable to expand */}
                                <button
                                    onClick={() => hasDetails && toggleStep(step.id)}
                                    className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-[var(--color-bg-subtle)]"
                                    disabled={!hasDetails}
                                >
                                    {/* Step icon */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                        style={{
                                            background: step.status === "done"
                                                ? `${color}15`
                                                : step.status === "running"
                                                    ? `${color}20`
                                                    : "var(--color-bg-muted)",
                                        }}
                                    >
                                        {step.status === "running" ? (
                                            <Loader2
                                                className="w-5 h-5 animate-spin"
                                                style={{ color }}
                                            />
                                        ) : step.status === "done" ? (
                                            <CheckCircle2
                                                className="w-5 h-5"
                                                style={{ color }}
                                            />
                                        ) : step.status === "error" ? (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <Icon className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                                        )}
                                    </div>

                                    {/* Step label & agent number */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest"
                                                style={{ color: step.status === "pending" ? "var(--color-text-tertiary)" : color }}
                                            >
                                                Agent {index + 1}
                                            </span>
                                            {step.status === "running" && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: color }} />
                                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: color, animationDelay: "200ms" }} />
                                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: color, animationDelay: "400ms" }} />
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm font-semibold ${step.status === "pending" ? "text-[var(--color-text-tertiary)]" : "text-[var(--color-text)]"}`}>
                                            {step.label}
                                        </p>
                                    </div>

                                    {/* Status badge */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {step.status === "done" && (
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${color}15`, color }}>
                                                Done
                                            </span>
                                        )}
                                        {step.status === "running" && (
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${color}15`, color }}>
                                                Working...
                                            </span>
                                        )}

                                        {/* Expand toggle */}
                                        {hasDetails && (
                                            <div className="text-[var(--color-text-tertiary)]">
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Expanded details — cascaded dropdown */}
                                {isExpanded && hasDetails && (
                                    <div className="px-4 pb-4 space-y-3 animate-fade-in">
                                        <div className="ml-14 border-l-2 border-[var(--color-border-light)] pl-4 space-y-3">
                                            {/* Detail text */}
                                            {step.detail && (
                                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                                    {step.detail}
                                                </p>
                                            )}

                                            {/* Substeps (e.g., individual search queries) */}
                                            {step.substeps && step.substeps.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                                                        Sub-tasks
                                                    </p>
                                                    {step.substeps.map((sub, si) => (
                                                        <div key={si} className="flex items-center gap-2">
                                                            {sub.status === "done" ? (
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                                            ) : sub.status === "running" ? (
                                                                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />
                                                            ) : (
                                                                <Circle className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] flex-shrink-0" />
                                                            )}
                                                            <span className="text-xs text-[var(--color-text-secondary)] truncate">
                                                                {sub.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Data insights */}
                                            {step.data && (
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(step.data).map(([key, value]) => (
                                                        <span
                                                            key={key}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-muted)] text-xs font-medium text-[var(--color-text-secondary)]"
                                                        >
                                                            <span className="text-[var(--color-text-tertiary)]">
                                                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}:
                                                            </span>
                                                            <span className="font-semibold text-[var(--color-text)]">
                                                                {Array.isArray(value) ? value.join(", ") : String(value)}
                                                            </span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
