"use client";

import { BarChart3 } from "lucide-react";
import { RepoScopedRedirect } from "@/components/shared/repo-scoped-redirect";

export default function MetricsIndexPage() {
    return (
        <RepoScopedRedirect
            segment="metrics"
            icon={BarChart3}
            title="No repository selected"
            description="Analyze a repository to view its engineering metrics."
        />
    );
}