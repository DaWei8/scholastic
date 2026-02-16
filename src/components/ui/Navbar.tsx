"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface NavLink {
    label: string;
    href: string;
}

interface NavbarProps {
    links?: NavLink[];
    ctaLabel?: string;
    ctaHref?: string;
}

export default function Navbar({
    links = [
        { label: "Scholarships", href: "/scholarships" },
        { label: "Features", href: "/#features" },
        { label: "How it Works", href: "/#how-it-works" },
        { label: "FAQ", href: "/#faq" },
    ],
    ctaLabel,
    ctaHref,
}: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleAuthAction = async () => {
        if (user) {
            await signOut();
            router.push("/");
        } else {
            router.push("/auth");
        }
    };

    const resolvedCtaLabel = ctaLabel || (user ? "Dashboard" : "Get Started");
    const resolvedCtaHref = ctaHref || (user ? "/dashboard" : "/auth");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border-light)]">
            <div className="section-container h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                        ScholarConnect
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {user && (
                        <button
                            onClick={handleAuthAction}
                            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    )}
                    <Link
                        href={resolvedCtaHref}
                        className="h-10 px-5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full inline-flex items-center gap-2 hover:bg-[var(--color-primary-hover)] transition-colors duration-200"
                    >
                        {resolvedCtaLabel}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-muted)] transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-[var(--color-border-light)] px-6 py-4 space-y-3">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] py-2 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href={resolvedCtaHref}
                        onClick={() => setMobileOpen(false)}
                        className="text-center h-10 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] transition-colors mt-2"
                    >
                        {resolvedCtaLabel}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {user && (
                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                handleAuthAction();
                            }}
                            className="w-full text-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] py-2 transition-colors"
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}
