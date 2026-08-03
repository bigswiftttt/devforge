"use client";

import { Network } from "lucide-react";
import { RepoScopedRedirect } from "@/components/shared/repo-scoped-redirect";

export default function DependenciesIndexPage() {
    return (
        <RepoScopedRedirect
            segment="dependencies"
            icon={Network}
            title="No repository selected"
            description="Analyze a repository to view its dependency graph."
        />
    );
}