"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Files, FolderOpen, HardDrive } from "lucide-react";
import { parseRepository } from "@/lib/parser/normalize";
import { createClient } from "@/lib/auth/supabase";
import type { NormalizedRepository } from "@/types/repository";
import { computeMetrics, formatBytes } from "@/lib/parser/metrics";
import { ChartCard } from "@/components/charts/chart-card";
import { MetricCard } from "@/components/metrics/metric-card";

export default function MetricsPage() {
    const params = useParams<{ owner: string; repo: string }>();
    const [data, setData] = useState<NormalizedRepository | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to parse repository.");
            } finally {
                setLoading(false);
            }
        }
        run();
    }, [params.owner, params.repo]);

    if (loading) {
        return (
            <div className="p-xl flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Computing metrics...
            </div>
        );
    }

    if (error || !data) {
        return <div className="p-xl text-destructive">{error ?? "No data found."}</div>;
    }

    const metrics = computeMetrics(data);

    const dirChartData = metrics.largestDirectories.map((d) => ({
        name: d.path,
        value: d.totalBytes,
    }));

    const langChartData = metrics.languagePercentages
        .slice(0, 8)
        .map((l) => ({ name: l.language, value: l.percentage }));

    return (
        <div className="p-lg lg:p-xl space-y-lg">
            <div>
                <h1 className="text-headline-lg text-foreground">Engineering Metrics</h1>
                <p className="text-body-md text-muted-foreground mt-1">
                    Repository statistics for {data.fullName}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <MetricCard label="Total Files" value={metrics.fileCount.toLocaleString()} icon={Files} />
                <MetricCard
                    label="Total Folders"
                    value={metrics.folderCount.toLocaleString()}
                    icon={FolderOpen}
                />
                <MetricCard
                    label="Repository Size"
                    value={formatBytes(metrics.totalSizeBytes)}
                    icon={HardDrive}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <ChartCard
                    title="Largest Directories"
                    subtitle="By total file size"
                    data={dirChartData}
                    valueFormatter={formatBytes}
                />
                <ChartCard
                    title="Language Breakdown"
                    subtitle="Percentage of codebase"
                    data={langChartData}
                    valueFormatter={(v) => `${v}%`}
                />
            </div>
        </div>
    );
}