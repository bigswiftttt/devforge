"use client";

import { GitBranch } from "lucide-react";
import { RepoScopedRedirect } from "@/components/shared/repo-scoped-redirect";

export default function ArchitectureIndexPage() {
    return (
        <RepoScopedRedirect
            segment="architecture"
            icon={GitBranch}
            title="No repository selected"
            description="Analyze a repository to view its architecture diagram."
        />
    );
}