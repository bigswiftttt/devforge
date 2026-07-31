"use client";

import { useParams } from "next/navigation";
import { Loader2, FolderTree } from "lucide-react";
import { useRepositoryData } from "@/hooks/use-repository-data";
import { RepoHeader } from "@/components/repository/repo-header";
import { LanguageBreakdown } from "@/components/repository/language-breakdown";
import { MarkdownViewer } from "@/components/shared/markdown-viewer";

export default function RepositoryOverviewPage() {
    const params = useParams<{ owner: string; repo: string }>();
    const { data, loading, error } = useRepositoryData(params.owner, params.repo);

    if (loading) {
        return (
            <div className="p-xl flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Parsing repository...
            </div>
        );
    }

    if (error || !data) {
        return <div className="p-xl text-destructive">{error ?? "No data found."}</div>;
    }

    return (
        <div>
            <RepoHeader
                fullName={data.fullName}
                description={data.description}
                stars={data.stars}
                forks={data.forks}
                primaryLanguage={data.primaryLanguage}
                ownerAvatar={`https://github.com/${params.owner}.png`}
            />

            <div className="p-lg space-y-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                    <div className="bg-card border border-border rounded-xl p-md">
                        <p className="text-label-caps text-muted-foreground uppercase">Files</p>
                        <p className="text-headline-sm text-foreground">{data.fileCount}</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-md">
                        <p className="text-label-caps text-muted-foreground uppercase">Folders</p>
                        <p className="text-headline-sm text-foreground">{data.folderCount}</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-md">
                        <p className="text-label-caps text-muted-foreground uppercase">Dependencies</p>
                        <p className="text-headline-sm text-foreground">
                            {data.packageJson ? Object.keys(data.packageJson.dependencies).length : "—"}
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-md">
                        <p className="text-label-caps text-muted-foreground uppercase">Recent Commits</p>
                        <p className="text-headline-sm text-foreground">{data.recentCommits.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                    <div className="lg:col-span-2 space-y-lg">
                        {data.readme && (
                            <div className="bg-card border border-border rounded-xl p-lg">
                                <h3 className="text-headline-sm text-foreground mb-md flex items-center gap-2">
                                    <FolderTree className="size-4 text-primary" />
                                    README
                                </h3>
                                <MarkdownViewer content={data.readme} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-lg">
                        <LanguageBreakdown languages={data.languages} />

                        <div className="bg-card border border-border rounded-xl p-lg">
                            <h3 className="text-headline-sm text-foreground mb-md">Recent Commits</h3>
                            <div className="space-y-3">
                                {data.recentCommits.map((c) => (
                                    <div key={c.sha} className="text-body-sm border-b border-border pb-2 last:border-0">
                                        <p className="text-foreground">{c.message}</p>
                                        <p className="text-muted-foreground text-code-sm mt-1">
                                            {c.author} · {c.sha}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}