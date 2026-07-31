"use client";

import { useState } from "react";
import { FolderGit2 } from "lucide-react";
import { RepositorySearch } from "@/components/repository/repository-search";
import { EmptyState } from "@/components/shared/empty-state";
import { type GithubRepoMetadata } from "@/lib/github/client";

export default function RepositoriesPage() {
    const [result, setResult] = useState<GithubRepoMetadata | null>(null);

    return (
        <div className="p-lg lg:p-xl space-y-xl">
            <div>
                <h1 className="text-headline-lg text-foreground">Repositories</h1>
                <p className="text-body-md text-muted-foreground mt-1">
                    Search for a GitHub repository to analyze.
                </p>
            </div>

            <RepositorySearch onResult={setResult} />

            {!result && (
                <EmptyState
                    icon={FolderGit2}
                    title="No repository selected"
                    description="Search for a repository above to see its metadata here."
                />
            )}

            {result && (
                <div className="bg-card border border-border rounded-xl p-lg space-y-2">
                    <div className="flex items-center gap-3">
                        <img src={result.owner.avatar_url} alt={result.owner.login} className="size-10 rounded-full" />
                        <div>
                            <h3 className="text-headline-sm text-foreground">{result.full_name}</h3>
                            <p className="text-body-sm text-muted-foreground">{result.description}</p>
                        </div>
                    </div>
                    <div className="flex gap-lg text-body-sm text-muted-foreground pt-2">
                        <span>⭐ {result.stargazers_count}</span>
                        <span>🍴 {result.forks_count}</span>
                        <span>{result.language ?? "Unknown"}</span>
                        <span>Default branch: {result.default_branch}</span>
                    </div>
                </div>
            )}
        </div>
    );
}