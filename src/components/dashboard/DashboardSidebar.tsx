"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Heart,
    GraduationCap,
    User,
    LogOut,
    BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const tabs = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/discover", label: "Discover", icon: Search },
    { href: "/dashboard/shortlist", label: "Shortlist", icon: Heart },
    { href: "/dashboard/scholarships", label: "Scholarships", icon: GraduationCap },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const isActive = (tab: typeof tabs[number]) =>
        tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-[var(--color-border-light)] bg-white">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-[var(--color-border-light)]">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
                        ScholarConnect
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = isActive(tab);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
                                }`}
                        >
                            <Icon className="w-[18px] h-[18px]" />
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Sign out */}
            <div className="p-4 border-t border-[var(--color-border-light)] space-y-3">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                        <span className="text-sm font-bold text-[var(--color-primary)]">
                            {user?.email?.[0]?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                            {user?.email || "User"}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">Free plan</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-tertiary)] hover:text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
