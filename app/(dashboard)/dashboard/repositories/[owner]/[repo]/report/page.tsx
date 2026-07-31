"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { parseRepository } from "@/lib/parser/normalize";
import { createClient } from "@/lib/auth/supabase";
import type { NormalizedRepository } from "@/types/repository";
import type { RepositoryInsight, RepositorySummaryInput } from "@/lib/ai/groq";
import { AIReportCard } from "@/components/ai/ai-report-card";
import { Button } from "@/components/ui/button";

export default function AIReportPage() {
    const params = useParams<{ owner: string; repo: string }>();
    const [repoData, setRepoData] = useState<NormalizedRepository | null>(null);
    const [insight, setInsight] = useState<RepositoryInsight | null>(null);
    const [loadingRepo, setLoadingRepo] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function run() {
            try {
                const supabase = createClient();
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                const accessToken = session?.provider_token;

                if (!accessToken) {
                    setError("No GitHub access token found.");
                    return;
                }

                const result = await parseRepository(params.owner, params.repo, accessToken);
                setRepoData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to parse repository.");
            } finally {
                setLoadingRepo(false);
            }
        }
        run();
    }, [params.owner, params.repo]);

    async function handleGenerateReport() {
        if (!repoData) return;
        setGenerating(true);
        setError(null);

        const summary: RepositorySummaryInput = {
            fullName: repoData.fullName,
            description: repoData.description,
            primaryLanguage: repoData.primaryLanguage,
            fileCount: repoData.fileCount,
            folderCount: repoData.folderCount,
            languages: repoData.languages.map((l) => ({
                language: l.language,
                percentage: l.percentage,
            })),
            topLevelFolders: Array.from(
                new Set(
                    repoData.fileTree
                        .filter((f) => f.path.includes("/"))
                        .map((f) => f.path.split("/")[0]),
                ),
            ).slice(0, 15),
            dependencyCount: repoData.packageJson
                ? Object.keys(repoData.packageJson.dependencies).length
                : 0,
            devDependencyCount: repoData.packageJson
                ? Object.keys(repoData.packageJson.devDependencies).length
                : 0,
            recentCommitMessages: repoData.recentCommits.map((c) => c.message).slice(0, 10),
        };

        try {
            const res = await fetch("/api/insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(summary),
            });

            if (!res.ok) {
                const errBody = await res.json();
                throw new Error(errBody.error ?? "Failed to generate report.");
            }

            const data: RepositoryInsight = await res.json();
            setInsight(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setGenerating(false);
        }
    }

    if (loadingRepo) {
        return (
            <div className="p-xl flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Loading repository data...
            </div>
        );
    }

    return (
        <div className="p-lg lg:p-xl space-y-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-headline-lg text-foreground">AI Insight Report</h1>
                    <p className="text-body-md text-muted-foreground mt-1">
                        Engineering analysis for {repoData?.fullName}
                    </p>
                </div>
                <Button onClick={handleGenerateReport} disabled={generating || !repoData} className="gap-2">
                    {generating ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Sparkles className="size-4" />
                    )}
                    {insight ? "Regenerate Report" : "Generate Report"}
                </Button>
            </div>

            {error && <p className="text-body-sm text-destructive">{error}</p>}

            {insight && <AIReportCard insight={insight} />}
        </div>
    );
}