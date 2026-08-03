"use client";

import { FileText } from "lucide-react";
import { RepoScopedRedirect } from "@/components/shared/repo-scoped-redirect";

export default function ReportIndexPage() {
    return (
        <RepoScopedRedirect
            segment="report"
            icon={FileText}
            title="No repository selected"
            description="Analyze a repository to generate an AI insight report."
        />
    );
}