"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { parseRepository } from "@/lib/parser/normalize";
import { createClient } from "@/lib/auth/supabase";
import type { NormalizedRepository } from "@/types/repository";
import { DependencyGraphView } from "@/components/graphs/dependency-graph";
import { EmptyState } from "@/components/shared/empty-state";
import { PackageX } from "lucide-react";

export default function DependenciesPage() {
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
                Parsing dependencies...
            </div>
        );
    }

    if (error || !data) {
        return <div className="p-xl text-destructive">{error ?? "No data found."}</div>;
    }

    return (
        <div className="p-lg lg:p-xl space-y-lg">
            <div>
                <h1 className="text-headline-lg text-foreground">Dependencies</h1>
                <p className="text-body-md text-muted-foreground mt-1">
                    Package dependencies for {data.fullName}
                </p>
            </div>

            {data.packageJson ? (
                <DependencyGraphView packageJson={data.packageJson} />
            ) : (
                <EmptyState
                    icon={PackageX}
                    title="No package.json found"
                    description="This repository doesn't have a package.json file, so there are no npm dependencies to visualize."
                />
            )}
        </div>
    );
}