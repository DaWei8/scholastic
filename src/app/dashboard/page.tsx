"use client";

import { useAuth } from "@/context/AuthContext";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <OverviewTab
            matchCount={0}
            shortlistCount={0}
            userName={user?.email?.split("@")[0]}
        />
    );
}
