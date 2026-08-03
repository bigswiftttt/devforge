"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRecentReposStore } from "@/store/recent-repos-store";
import { EmptyState } from "@/components/shared/empty-state";

interface RepoScopedRedirectProps {
    segment: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

export function RepoScopedRedirect({ segment, icon, title, description }: RepoScopedRedirectProps) {
    const router = useRouter();
    const repos = useRecentReposStore((s) => s.repos);
    const lastRepo = repos[0];

    useEffect(() => {
        if (lastRepo) {
            router.replace(`/dashboard/repositories/${lastRepo.owner}/${lastRepo.repo}/${segment}`);
        }
    }, [lastRepo, router, segment]);

    if (lastRepo) {
        return (
            <div className="p-xl flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Redirecting to {lastRepo.fullName}...
            </div>
        );
    }

    return (
        <div className="p-lg lg:p-xl">
            <EmptyState
                icon={icon}
                title={title}
                description={description}
                actionLabel="Analyze a repository"
                onAction={() => (window.location.href = "/dashboard/repositories")}
            />
        </div>
    );
}