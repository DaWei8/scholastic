"use client";

import { useAuth } from "@/context/AuthContext";
import DiscoverTab from "@/components/dashboard/tabs/DiscoverTab";

export default function DiscoverPage() {
    const { user } = useAuth();

    return (
        <DiscoverTab userEmail={user?.email || ""} />
    );
}
