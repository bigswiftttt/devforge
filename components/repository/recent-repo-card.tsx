import Link from "next/link";
import { FolderGit2, Clock } from "lucide-react";
import type { RecentRepo } from "@/store/recent-repos-store";

function timeAgo(dateString: string): string {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function RecentRepoCard({ repo }: { repo: RecentRepo }) {
    return (
        <Link
            href={`/dashboard/repositories/${repo.owner}/${repo.repo}`}
            className="bg-card border border-border rounded-xl p-lg hover:border-primary/50 transition-colors block"
        >
            <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-muted rounded flex items-center justify-center">
                        <FolderGit2 className="size-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-body-lg font-bold text-foreground">{repo.fullName}</h4>
                        <p className="text-code-sm text-muted-foreground">
                            {repo.primaryLanguage ?? "Unknown"}
                        </p>
                    </div>
                </div>
            </div>

            {repo.description && (
                <p className="text-body-sm text-muted-foreground mb-md line-clamp-2">
                    {repo.description}
                </p>
            )}

            <div className="flex items-center justify-between text-label-caps text-muted-foreground">
                <span>{repo.fileCount} files</span>
                <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {timeAgo(repo.analyzedAt)}
                </span>
            </div>
        </Link>
    );
}