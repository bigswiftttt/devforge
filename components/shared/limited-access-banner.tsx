"use client";

import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LimitedAccessBanner() {
    const { isLimitedAccess, signInWithGithub } = useAuth();

    if (!isLimitedAccess) return null;

    return (
        <div className="flex items-center gap-3 bg-chart-5/10 border border-chart-5/30 rounded-lg px-md py-sm mb-lg">
            <AlertCircle className="size-4 text-chart-5 shrink-0" />
            <p className="text-body-sm text-foreground flex-1">
                You're signed in with Google — limited to public repositories and a lower GitHub API
                rate limit.{" "}
                <button onClick={signInWithGithub} className="text-primary hover:underline font-medium">
                    Sign in with GitHub
                </button>{" "}
                for full access.
            </p>
        </div>
    );
}