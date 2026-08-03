"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseRepoInput, fetchRepoMetadata } from "@/lib/github/client";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/auth/supabase";

export function RepositorySearch() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    async function handleSearch() {
        setError(null);

        const parsed = parseRepoInput(input);
        if (!parsed) {
            setError('Enter a repo as "owner/repo" or a full GitHub URL.');
            return;
        }

        if (!user) {
            setError("You must be signed in to analyze a repository.");
            return;
        }

        setLoading(true);
        try {
            const supabase = createClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session?.user) {
                setError("Not authenticated.");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("github_access_token")
                .eq("id", session.user.id)
                .single();

            const accessToken = profile?.github_access_token;

            if (!accessToken) {
                setError("GitHub access token not found. Try signing out and back in.");
                return;
            }

            // Quick existence check before navigating — gives a clean error
            // ("repo not found") instead of navigating to a page that fails.
            await fetchRepoMetadata(parsed.owner, parsed.repo, accessToken);

            router.push(`/dashboard/repositories/${parsed.owner}/${parsed.repo}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="owner/repo or https://github.com/owner/repo"
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? <Loader2 className="size-4 animate-spin" /> : "Analyze"}
                </Button>
            </div>
            {error && <p className="text-body-sm text-destructive">{error}</p>}
        </div>
    );
}