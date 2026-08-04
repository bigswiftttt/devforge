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

function GoogleMark({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.1A12 12 0 0 0 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.31 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.31v-3.1H1.3A12 12 0 0 0 0 12c0 1.93.46 3.76 1.3 5.41z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.59l4.01 3.1C6.25 6.85 8.89 4.75 12 4.75z"
            />
        </svg>
    );
}

export function LoginForm() {
    const { signInWithGithub, signInWithGoogle } = useAuth();
    const searchParams = useSearchParams();
    const [redirectingTo, setRedirectingTo] = useState<"github" | "google" | null>(null);

    const authError = searchParams.get("error");

    async function handleGithubSignIn() {
        setRedirectingTo("github");
        try {
            await signInWithGithub();
        } catch {
            setRedirectingTo(null);
        }
    }

    async function handleGoogleSignIn() {
        setRedirectingTo("google");
        try {
            await signInWithGoogle();
        } catch {
            setRedirectingTo(null);
        }
    }

    return (
        <main className="relative z-10 w-full max-w-[400px]">
            {/* Identity anchor */}
            <div className="flex flex-col items-center mb-xl">
                <div className="mb-lg size-12 flex items-center justify-center rounded-lg bg-muted border border-border shadow-card">
                    <Terminal className="size-6 text-primary" />
                </div>
                <h1 className="text-headline-sm text-foreground tracking-tight mb-1">
                    Sign in to DevForge
                </h1>
                <p className="text-body-sm text-muted-foreground">Intelligent repository orchestration</p>
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
                    onClick={handleGithubSignIn}
                    disabled={redirectingTo !== null}
                    className={cn(
                        "w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-body-md transition-all",
                        "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]",
                        "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                    )}
                >
                    {redirectingTo === "github" ? (
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

                <button
                    onClick={handleGoogleSignIn}
                    disabled={redirectingTo !== null}
                    className={cn(
                        "w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-body-md transition-all",
                        "bg-background border border-border text-foreground hover:bg-muted active:scale-[0.98]",
                        "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                    )}
                >
                    {redirectingTo === "google" ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Redirecting to Google...
                        </>
                    ) : (
                        <>
                            <GoogleMark className="size-5" />
                            Continue with Google
                        </>
                    )}
                </button>

                <p className="text-code-sm text-muted-foreground text-center px-md leading-relaxed">
                    Google sign-in provides limited access — public repositories only, lower rate limit.
                </p>

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
    );
}