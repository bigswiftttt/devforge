"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-md text-center px-lg">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="size-8 text-destructive" />
            </div>
            <div>
                <h2 className="text-headline-sm text-foreground">Something went wrong</h2>
                <p className="text-body-md text-muted-foreground mt-1 max-w-md">
                    {error.message || "An unexpected error occurred while loading this page."}
                </p>
            </div>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}