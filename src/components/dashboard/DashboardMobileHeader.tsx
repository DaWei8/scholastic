"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Heart,
    GraduationCap,
    User,
    BookOpen,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const tabs = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/discover", label: "Discover", icon: Search },
    { href: "/dashboard/shortlist", label: "Shortlist", icon: Heart },
    { href: "/dashboard/scholarships", label: "Scholarships", icon: GraduationCap },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardMobileHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const isActive = (tab: typeof tabs[number]) =>
        tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

    return (
        <header className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-border-light)]">
            <div className="flex items-center justify-between h-14 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-base font-bold text-[var(--color-text)] tracking-tight">
                        ScholarConnect
                    </span>
                </Link>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-muted)] transition-colors"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="border-t border-[var(--color-border-light)] bg-white px-4 py-3 space-y-1 animate-fade-in">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActive(tab);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                onClick={() => setMenuOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
                                    }`}
                            >
                                <Icon className="w-[18px] h-[18px]" />
                                {tab.label}
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => { setMenuOpen(false); handleSignOut(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-text-tertiary)] hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        Sign out
                    </button>
                </div>
            )}

            {/* Bottom tab bar for mobile */}
            <div className="flex items-center border-t border-[var(--color-border-light)] bg-white">
                {tabs.slice(0, 4).map((tab) => {
                    const Icon = tab.icon;
                    const active = isActive(tab);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${active
                                ? "text-[var(--color-primary)]"
                                : "text-[var(--color-text-tertiary)]"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </header>
    );
}
