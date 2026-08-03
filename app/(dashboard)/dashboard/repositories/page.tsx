"use client";

import { FolderGit2 } from "lucide-react";
import { RepositorySearch } from "@/components/repository/repository-search";
import { EmptyState } from "@/components/shared/empty-state";

export default function RepositoriesPage() {
    return (
        <div className="p-lg lg:p-xl space-y-xl">
            <div>
                <h1 className="text-headline-lg text-foreground">Repositories</h1>
                <p className="text-body-md text-muted-foreground mt-1">
                    Search for a GitHub repository to analyze.
                </p>
            </div>

            <RepositorySearch />

            <EmptyState
                icon={FolderGit2}
                title="Search to get started"
                description="Enter a repository above and click Analyze — you'll be taken straight to its full breakdown: architecture, dependencies, metrics, and AI insights."
            />
        </div>
    );
}