"use client";

import Link from "next/link";
import { Clock, FolderGit2, Search } from "lucide-react";
import { useRecentReposStore } from "@/store/recent-repos-store";
import { RecentRepoCard } from "@/components/repository/recent-repo-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const repos = useRecentReposStore((s) => s.repos);

    return (
        <div className="p-lg lg:p-xl space-y-xl">
            <header>
                <p className="text-label-caps text-primary mb-1 uppercase">System Overview</p>
                <h1 className="text-headline-lg text-foreground tracking-tight">
                    Engineer Intelligence Console
                </h1>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="bg-card border border-border rounded-xl p-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FolderGit2 className="size-4" />
                        <p className="text-label-caps uppercase">Repositories Analyzed</p>
                    </div>
                    <h2 className="text-headline-md text-primary">{repos.length}</h2>
                    <p className="text-body-sm text-muted-foreground mt-1">In this browser</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="size-4" />
                        <p className="text-label-caps uppercase">Last Analyzed</p>
                    </div>
                    <h2 className="text-headline-md text-foreground truncate">
                        {repos[0]?.fullName ?? "—"}
                    </h2>
                    <p className="text-body-sm text-muted-foreground mt-1">
                        {repos[0] ? "See recent repositories below" : "No repositories yet"}
                    </p>
                </div>
            </section>

            <section className="space-y-md">
                <div className="flex items-center justify-between">
                    <h3 className="text-headline-sm text-foreground">Recent Repositories</h3>
                    <Link href="/dashboard/repositories">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Search className="size-4" />
                            Analyze a repository
                        </Button>
                    </Link>
                </div>

                {repos.length === 0 ? (
                    <EmptyState
                        icon={FolderGit2}
                        title="No repositories analyzed yet"
                        description="Search for a GitHub repository to get started with real parsing, architecture visualization, and AI insights."
                        actionLabel="Analyze a repository"
                        onAction={() => (window.location.href = "/dashboard/repositories")}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-lg">
                        {repos.map((repo) => (
                            <RecentRepoCard key={repo.fullName} repo={repo} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}