"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/auth/supabase";
import { fetchUserRepos, type GithubUserRepo } from "@/lib/github/client";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderGit2 } from "lucide-react";

function timeAgo(dateString: string): string {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days < 1) return "today";
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

export function ImportRepoList() {
    const [repos, setRepos] = useState<GithubUserRepo[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const supabase = createClient();
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                const accessToken = session?.provider_token;

                if (!accessToken) {
                    setError("Sign in with GitHub to import your repositories.");
                    return;
                }

                const result = await fetchUserRepos(accessToken);
                setRepos(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load your repositories.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground py-lg">
                <Loader2 className="size-4 animate-spin" />
                Loading your repositories...
            </div>
        );
    }

    if (error) {
        return <p className="text-body-sm text-muted-foreground py-lg">{error}</p>;
    }

    if (!repos || repos.length === 0) {
        return (
            <EmptyState
                icon={FolderGit2}
                title="No public repositories found"
                description="Your GitHub account doesn't have any public repositories to import."
            />
        );
    }

    return (
        <div className="space-y-sm">
            <div className="flex items-center justify-between">
                <p className="text-label-caps text-muted-foreground uppercase">
                    {repos.length} public repositories
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {repos.map((repo) => (
                    <button
                        key={repo.id}
                        onClick={() => router.push(`/dashboard/repositories/${repo.owner.login}/${repo.name}`)}
                        className="text-left bg-card border border-border rounded-lg p-md hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-body-md font-bold text-foreground truncate">{repo.name}</h4>
                            {repo.stargazers_count > 0 && (
                                <span className="flex items-center gap-1 text-label-caps text-muted-foreground shrink-0 ml-2">
                                    <Star className="size-3" />
                                    {repo.stargazers_count}
                                </span>
                            )}
                        </div>
                        {repo.description && (
                            <p className="text-body-sm text-muted-foreground line-clamp-2 mb-2">
                                {repo.description}
                            </p>
                        )}
                        <div className="flex items-center justify-between text-label-caps text-muted-foreground">
                            <span>{repo.language ?? "Unknown"}</span>
                            <span className="flex items-center gap-1">
                                <RefreshCw className="size-3" />
                                {timeAgo(repo.updated_at)}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}