import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-[var(--color-border-light)] py-12 px-6">
            <div className="section-container flex flex-col md:flex-row justify-between items-center gap-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[var(--color-primary)] rounded-md flex items-center justify-center">
                        <BookOpen className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-sm text-[var(--color-text)]">
                        ScholarConnect
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    {[
                        { label: "Scholarships", href: "/scholarships" },
                        { label: "Privacy", href: "#" },
                        { label: "Terms", href: "#" },
                        { label: "Contact", href: "#" },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <p className="text-xs text-[var(--color-text-tertiary)]">
                    © 2026 ScholarConnect
                </p>
            </div>
        </footer>
    );
}
