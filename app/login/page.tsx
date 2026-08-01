"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Terminal, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function GithubMark({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

export default function LoginPage() {
    const { signInWithGithub } = useAuth();
    const searchParams = useSearchParams();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const authError = searchParams.get("error");

    async function handleSignIn() {
        setIsRedirecting(true);
        try {
            await signInWithGithub();
        } catch {
            setIsRedirecting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-lg relative overflow-hidden">
            {/* Subtle ambient background glow, matches app's teal accent */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(at 0% 0%, oklch(0.87 0.15 195 / 6%) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.87 0.15 195 / 6%) 0px, transparent 50%)",
                }}
            />

            <main className="relative z-10 w-full max-w-[400px]">
                {/* Identity anchor */}
                <div className="flex flex-col items-center mb-xl">
                    <div className="mb-lg size-12 flex items-center justify-center rounded-lg bg-muted border border-border shadow-card">
                        <Terminal className="size-6 text-primary" />
                    </div>
                    <h1 className="text-headline-sm text-foreground tracking-tight mb-1">
                        Sign in to DevForge
                    </h1>
                    <p className="text-body-sm text-muted-foreground">
                        Intelligent repository orchestration
                    </p>
                </div>

                {/* Auth card */}
                <div className="bg-card border border-border rounded-xl p-lg shadow-card space-y-md">
                    {authError && (
                        <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-md py-sm">
                            <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                            <p className="text-body-sm text-destructive">
                                We couldn&apos;t complete sign-in. Please try again.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleSignIn}
                        disabled={isRedirecting}
                        className={cn(
                            "w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-body-md transition-all",
                            "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]",
                            "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                        )}
                    >
                        {isRedirecting ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Redirecting to GitHub...
                            </>
                        ) : (
                            <>
                                <GithubMark className="size-5" />
                                Continue with GitHub
                            </>
                        )}
                    </button>

                    <p className="text-code-sm text-muted-foreground text-center px-md leading-relaxed">
                        By continuing, you agree to DevForge&apos;s Terms of Service and Privacy Policy.
                    </p>
                </div>

                {/* System status footer */}
                <div className="mt-xl flex items-center justify-center gap-2 text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    <span className="text-label-caps uppercase">Secure OAuth session</span>
                </div>
            </main>
        </div>
    );
}