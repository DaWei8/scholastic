import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode, ButtonHTMLAttributes } from "react";

/* ─── Badge ────────────────────────────────────── */
interface BadgeProps {
    children: ReactNode;
    variant?: "primary" | "subtle" | "outline";
    dot?: boolean;
}

export function Badge({
    children,
    variant = "primary",
    dot = false,
}: BadgeProps) {
    const base =
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest";

    const variants = {
        primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
        subtle: "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]",
        outline:
            "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
    };

    return (
        <div className={`${base} ${variants[variant]}`}>
            {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            )}
            {children}
        </div>
    );
}

/* ─── Button ───────────────────────────────────── */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    icon?: ReactNode;
    children: ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    href,
    icon,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 active:scale-[0.98] select-none";

    const variants = {
        primary:
            "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm",
        secondary:
            "bg-[var(--color-text)] text-white hover:bg-[var(--color-text)]/90",
        outline:
            "border-2 border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text-tertiary)] bg-white",
        ghost:
            "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
    };

    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={cls}>
                {children}
                {icon ?? (variant === "primary" && <ArrowRight className="w-4 h-4" />)}
            </Link>
        );
    }

    return (
        <button className={cls} {...props}>
            {children}
            {icon}
        </button>
    );
}

/* ─── SectionHeader ────────────────────────────── */
interface SectionHeaderProps {
    badge?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
}

export function SectionHeader({
    badge,
    title,
    description,
    align = "left",
}: SectionHeaderProps) {
    const alignment = align === "center" ? "text-center mx-auto" : "";

    return (
        <div className={`max-w-2xl mb-16 ${alignment}`}>
            {badge && (
                <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-3">
                    {badge}
                </p>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)] tracking-tight leading-[1.1]">
                {title}
            </h2>
            {description && (
                <p className="mt-4 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}

/* ─── FeatureCard ──────────────────────────────── */
interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="card group p-7">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                {title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {description}
            </p>
        </div>
    );
}

/* ─── StepItem ─────────────────────────────────── */
interface StepItemProps {
    number: string;
    title: string;
    description: string;
}

export function StepItem({ number, title, description }: StepItemProps) {
    return (
        <div className="flex gap-5 group">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0 group-hover:bg-[var(--color-primary-hover)] transition-colors duration-200">
                {number}
            </div>
            <div>
                <h4 className="font-bold text-[var(--color-text)] mb-1">{title}</h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* ─── StatBlock ────────────────────────────────── */
interface StatBlockProps {
    value: string;
    label: string;
}

export function StatBlock({ value, label }: StatBlockProps) {
    return (
        <div className="text-center space-y-1">
            <p className="text-4xl md:text-5xl font-black text-[var(--color-primary)] tracking-tight">
                {value}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                {label}
            </p>
        </div>
    );
}

/* ─── FAQItem ──────────────────────────────────── */
interface FAQItemProps {
    question: string;
    answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
    return (
        <details className="group border-b border-[var(--color-border-light)] last:border-0">
            <summary className="flex items-center justify-between py-5 cursor-pointer list-none select-none">
                <h4 className="text-base font-semibold text-[var(--color-text)] pr-8">
                    {question}
                </h4>
                <svg
                    className="w-4 h-4 text-[var(--color-text-tertiary)] group-open:rotate-180 transition-transform duration-200 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </summary>
            <p className="pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                {answer}
            </p>
        </details>
    );
}
