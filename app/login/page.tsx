"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const { signInWithGithub } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-[400px] rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-headline-sm text-foreground">Sign in to DevForge</h1>
                    <p className="text-body-sm text-muted-foreground">
                        Intelligent repository orchestration
                    </p>
                </div>
                <Button onClick={signInWithGithub} className="w-full">
                    Continue with GitHub
                </Button>
            </div>
        </div>
    );
}