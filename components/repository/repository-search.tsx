"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseRepoInput, fetchRepoMetadata, type GithubRepoMetadata } from "@/lib/github/client";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/auth/supabase";

interface RepositorySearchProps {
    onResult: (metadata: GithubRepoMetadata) => void;
}

export function RepositorySearch({ onResult }: RepositorySearchProps) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    async function handleSearch() {
        setError(null);

        const parsed = parseRepoInput(input);
        if (!parsed) {
            setError("Enter a repo as \"owner/repo\" or a full GitHub URL.");
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
            const accessToken = session?.provider_token;

            if (!accessToken) {
                setError("GitHub access token not found. Try signing out and back in.");
                return;
            }

            const metadata = await fetchRepoMetadata(parsed.owner, parsed.repo, accessToken);
            onResult(metadata);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
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