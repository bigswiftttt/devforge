"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/auth/supabase";

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    isLimitedAccess: boolean;
    signInWithGithub: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLimitedAccess, setIsLimitedAccess] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function checkAccess() {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setIsLimitedAccess(Boolean(session?.user) && !session?.provider_token);
            setLoading(false);
        }
        checkAccess();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLimitedAccess(Boolean(session?.user) && !session?.provider_token);
            setLoading(false);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    async function signInWithGithub() {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }

    async function signOut() {
        setUser(null);
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("Sign out error:", err);
        } finally {
            window.location.href = "/login";
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, isLimitedAccess, signInWithGithub, signInWithGoogle, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}