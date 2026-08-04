"use client";

import { useEffect, useState } from "react";
import { parseRepository } from "@/lib/parser/normalize";
import { createClient } from "@/lib/auth/supabase";
import type { NormalizedRepository } from "@/types/repository";
import { useRepositoryStore } from "@/store/repository-store";

export function useRepositoryData(owner: string, repo: string) {
    const [data, setData] = useState<NormalizedRepository | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const setCurrentRepository = useRepositoryStore((s) => s.setCurrentRepository);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError(null);
            try {
                const supabase = createClient();
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                const accessToken = session?.provider_token ?? undefined;

                const result = await parseRepository(owner, repo, accessToken ?? "");
                if (!cancelled) {
                    setData(result);
                    setCurrentRepository(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to parse repository.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [owner, repo, setCurrentRepository]);

    return { data, loading, error };
}