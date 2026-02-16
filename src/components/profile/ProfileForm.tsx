"use client";

import { useState } from "react";
import {
    User,
    FileText,
    BookOpen,
    Globe,
    ArrowRight,
    ArrowLeft,
    Check,
    AlertCircle,
    Search,
} from "lucide-react";

interface ProfileFormData {
    fullName: string;
    degreeLevel: string;
    resumeText: string;
    researchInterests: string;
    targetCountries: string[];
    additionalInfo: string;
}

interface ProfileFormProps {
    userEmail: string;
    onComplete: (data: ProfileFormData) => void;
    onFindMatches: (resumeText: string) => void;
    loading?: boolean;
}

const DEGREE_LEVELS = [
    "Bachelor's",
    "Master's",
    "PhD",
    "Postdoc",
    "Other",
];

const COUNTRIES = [
    { code: "US", label: "United States", flag: "🇺🇸" },
    { code: "UK", label: "United Kingdom", flag: "🇬🇧" },
    { code: "CN", label: "China", flag: "🇨🇳" },
    { code: "DE", label: "Germany", flag: "🇩🇪" },
    { code: "FR", label: "France", flag: "🇫🇷" },
    { code: "SE", label: "Sweden", flag: "🇸🇪" },
    { code: "NL", label: "Netherlands", flag: "🇳🇱" },
    { code: "CA", label: "Canada", flag: "🇨🇦" },
    { code: "AU", label: "Australia", flag: "🇦🇺" },
    { code: "JP", label: "Japan", flag: "🇯🇵" },
];

const STEPS = [
    { label: "About You", icon: User },
    { label: "Research", icon: FileText },
    { label: "Interests", icon: BookOpen },
    { label: "Preferences", icon: Globe },
];

export default function ProfileForm({
    userEmail,
    onComplete,
    onFindMatches,
    loading = false,
}: ProfileFormProps) {
    const [step, setStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: "",
        degreeLevel: "",
        resumeText: "",
        researchInterests: "",
        targetCountries: [],
        additionalInfo: "",
    });

    const updateField = <K extends keyof ProfileFormData>(
        key: K,
        value: ProfileFormData[K]
    ) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setError(null);
    };

    const toggleCountry = (code: string) => {
        setFormData((prev) => ({
            ...prev,
            targetCountries: prev.targetCountries.includes(code)
                ? prev.targetCountries.filter((c) => c !== code)
                : [...prev.targetCountries, code],
        }));
    };

    const validateStep = (): boolean => {
        switch (step) {
            case 0:
                if (!formData.fullName.trim()) {
                    setError("Please enter your full name.");
                    return false;
                }
                if (!formData.degreeLevel) {
                    setError("Please select your degree level.");
                    return false;
                }
                return true;
            case 1:
                if (!formData.resumeText.trim()) {
                    setError("Please paste your CV or research summary.");
                    return false;
                }
                return true;
            case 2:
                if (!formData.researchInterests.trim()) {
                    setError("Please describe your research interests.");
                    return false;
                }
                return true;
            case 3:
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setError(null);
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
        }
    };

    const prevStep = () => {
        setError(null);
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleFinish = () => {
        onComplete(formData);
        // Also trigger matching with the combined profile text
        const profileText = [
            formData.resumeText,
            `Research interests: ${formData.researchInterests}`,
            formData.additionalInfo,
        ]
            .filter(Boolean)
            .join("\n\n");
        onFindMatches(profileText);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2">
                {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = i === step;
                    const isDone = i < step;

                    return (
                        <div key={s.label} className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (isDone) {
                                        setStep(i);
                                        setError(null);
                                    }
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${isActive
                                        ? "bg-[var(--color-primary)] text-white"
                                        : isDone
                                            ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] cursor-pointer"
                                            : "bg-[var(--color-bg-muted)] text-[var(--color-text-tertiary)]"
                                    }`}
                            >
                                {isDone ? (
                                    <Check className="w-3 h-3" />
                                ) : (
                                    <Icon className="w-3 h-3" />
                                )}
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-6 h-px ${isDone
                                            ? "bg-[var(--color-primary)]"
                                            : "bg-[var(--color-border)]"
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Form card */}
            <div className="card-static rounded-2xl p-8 space-y-6">
                {/* Step 0: About You */}
                {step === 0 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                                Let's start with the basics
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Tell us a bit about yourself so we can personalize your
                                experience.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[var(--color-text)]">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    placeholder="e.g. Amina Okafor"
                                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[var(--color-text)]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={userEmail}
                                    disabled
                                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] text-sm text-[var(--color-text-secondary)] cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-[var(--color-text)]">
                                    What degree are you pursuing or planning to pursue?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {DEGREE_LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => updateField("degreeLevel", level)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${formData.degreeLevel === level
                                                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                                    : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Research Background */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                                Share your research background
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Paste your academic CV, thesis abstract, or a summary of your
                                research experience. This helps us match you with the right
                                supervisors.
                            </p>
                        </div>

                        <textarea
                            value={formData.resumeText}
                            onChange={(e) => updateField("resumeText", e.target.value)}
                            placeholder="E.g. I completed my Master's in Computer Science at the University of Lagos, focusing on natural language processing for low-resource African languages. My thesis explored cross-lingual transfer learning using multilingual transformer models..."
                            rows={8}
                            className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none leading-relaxed"
                        />

                        <p className="text-xs text-[var(--color-text-tertiary)]">
                            Tip: The more detail you provide, the better your matches will be.
                        </p>
                    </div>
                )}

                {/* Step 2: Research Interests */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                                What are your research interests?
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                List the topics, fields, or specific problems you're most
                                interested in. This helps us find the best fit.
                            </p>
                        </div>

                        <textarea
                            value={formData.researchInterests}
                            onChange={(e) =>
                                updateField("researchInterests", e.target.value)
                            }
                            placeholder="E.g. Natural language processing, low-resource languages, cross-lingual transfer learning, multilingual models, African language technology"
                            rows={4}
                            className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none leading-relaxed"
                        />
                    </div>
                )}

                {/* Step 3: Preferences */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                                Where would you like to study?
                            </h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Select the countries you're interested in. This helps us filter
                                scholarships and supervisors for you. You can skip this if you're
                                open to anywhere.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {COUNTRIES.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => toggleCountry(country.code)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${formData.targetCountries.includes(country.code)
                                            ? "bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]"
                                            : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]"
                                        }`}
                                >
                                    <span className="text-lg">{country.flag}</span>
                                    {country.label}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-[var(--color-text)]">
                                Anything else? (Optional)
                            </label>
                            <textarea
                                value={formData.additionalInfo}
                                onChange={(e) => updateField("additionalInfo", e.target.value)}
                                placeholder="E.g. I'm looking for fully-funded PhD positions starting Fall 2027. I prefer labs that work on applied machine learning..."
                                rows={3}
                                className="w-full p-4 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                    {step > 0 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="h-11 px-6 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-[var(--color-primary-hover)] transition-colors"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFinish}
                            disabled={loading}
                            className="h-11 px-6 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Find My Matches
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Step hint */}
            <p className="text-center text-xs text-[var(--color-text-tertiary)]">
                Step {step + 1} of {STEPS.length} ·{" "}
                {step < STEPS.length - 1
                    ? "Your progress is saved automatically"
                    : "You're all set — let's find your matches"}
            </p>
        </div>
    );
}
