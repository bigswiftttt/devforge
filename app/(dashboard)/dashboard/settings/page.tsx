"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/auth/supabase";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTheme, type ThemeSetting } from "@/hooks/use-theme";
import { PreferencesSection } from "./preferences-section";
import { useAuth } from "@/hooks/use-auth";

/**
 * Stitch design tokens (hardcoded as arbitrary Tailwind values since these
 * aren't registered in tailwind.config.js). Pulled 1:1 from the Stitch export.
 */
const c = {
    surface: "#121315",
    surfaceContainerLowest: "#0d0e10",
    surfaceContainerLow: "#1b1c1e",
    surfaceContainer: "#1f2022",
    surfaceContainerHigh: "#292a2c",
    surfaceContainerHighest: "#343537",
    onSurface: "#e3e2e5",
    onSurfaceVariant: "#bac9cc",
    primary: "#c3f5ff",
    primaryContainer: "#00e5ff",
    onPrimaryContainer: "#00626e",
    onPrimary: "#00363d",
    secondaryContainer: "#43474e",
    onSecondaryContainer: "#b2b5bd",
    outline: "#849396",
    outlineVariant: "#3b494c",
    error: "#ffb4ab",
    errorContainer: "#93000a",
    onError: "#690005",
    tertiary: "#ffeac0",
    tertiaryContainer: "#fec931",
    onTertiaryContainer: "#6f5500",
};

/* ---------- Reusable primitives that mirror the Stitch classes ---------- */

function GlassPanel({
    className,
    children,
    style,
}: {
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}) {
    return (
        <section
            className={cn(
                "rounded-xl p-6 backdrop-blur-md",
                className,
            )}
            style={{
                background: "rgba(22, 22, 24, 0.7)",
                border: `1px solid ${c.outlineVariant}`,
                ...style,
            }}
        >
            {children}
        </section>
    );
}

function SectionEyebrow({
    icon,
    title,
    tone = "default",
}: {
    icon: React.ReactNode;
    title: string;
    tone?: "default" | "danger";
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span
                className="text-[20px] leading-none"
                style={{ color: tone === "danger" ? c.error : c.primary }}
            >
                {icon}
            </span>
            <h2
                className="text-[20px] leading-7 font-semibold tracking-[-0.01em]"
                style={{ color: tone === "danger" ? c.error : c.onSurface }}
            >
                {title}
            </h2>
        </div>
    );
}

function Pill({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
                aria-label={label}
            />
            <div
                className="w-11 h-6 rounded-full peer transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"
                style={{
                    backgroundColor: checked ? c.primaryContainer : c.secondaryContainer,
                }}
            />
        </label>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div
            className="flex items-center justify-between py-3 border-b last:border-0"
            style={{ borderColor: c.outlineVariant }}
        >
            <div>
                <p className="text-sm leading-5" style={{ color: c.onSurface }}>
                    {label}
                </p>
                <p className="text-xs leading-[18px] mt-0.5" style={{ color: c.onSurfaceVariant }}>
                    {description}
                </p>
            </div>
            <Pill checked={checked} onChange={onChange} label={label} />
        </div>
    );
}

function LabelCaps({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="font-mono text-[11px] leading-4 font-semibold uppercase tracking-[0.05em]"
            style={{ color: c.onSurfaceVariant }}
        >
            {children}
        </span>
    );
}

/* --------------------------------- Page ---------------------------------- */

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [githubConnected, setGithubConnected] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { signOut } = useAuth();

    const [notifyAnalysis, setNotifyAnalysis] = useState(true);
    const [notifySecurity, setNotifySecurity] = useState(true);
    const [notifyWeekly, setNotifyWeekly] = useState(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        async function loadUser() {
            const supabase = createClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session?.user) {
                setEmail(session.user.email ?? "");
                setAvatarUrl(session.user.user_metadata?.avatar_url ?? "");

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("github_access_token")
                    .eq("id", session.user.id)
                    .single();

                setGithubConnected(Boolean(profile?.github_access_token));
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    async function handleReconnectGithub() {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }

    async function handleSaveProfile() {
        setSavingProfile(true);
        await new Promise((r) => setTimeout(r, 600));
        setSavingProfile(false);
    }

    async function handleDeleteAccount() {
        setDeleteDialogOpen(false);
    }

    if (loading) {
        return (
            <div
                className="p-10 flex items-center gap-2 text-sm"
                style={{ color: c.onSurfaceVariant, background: c.surface }}
            >
                <span
                    className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                    style={{ color: c.primary }}
                />
                Loading settings...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-6 lg:p-10"
            style={{ background: c.surface, color: c.onSurface }}
        >
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Page header */}
                <div>
                    <h1 className="text-[32px] leading-10 font-semibold tracking-[-0.02em]" style={{ color: c.onSurface }}>
                        Settings
                    </h1>
                    <p className="text-base leading-6 mt-1" style={{ color: c.onSurfaceVariant }}>
                        Manage your account, integrations, and preferences.
                    </p>
                </div>

                {/* Profile */}
                <GlassPanel className="space-y-6">
                    <SectionEyebrow icon="person" title="Profile" />

                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="size-16 rounded-full border"
                                style={{ borderColor: c.outlineVariant }}
                            />
                        ) : (
                            <div
                                className="size-16 rounded-full flex items-center justify-center border"
                                style={{ background: c.surfaceContainerHighest, borderColor: c.outlineVariant }}
                            >
                                <span className="text-[24px]" style={{ color: c.onSurfaceVariant }}>
                                    person
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="text-base leading-6 font-medium" style={{ color: c.onSurface }}>
                                {email || "Unknown user"}
                            </p>
                            <p className="text-xs leading-[18px]" style={{ color: c.onSurfaceVariant }}>
                                Signed in via GitHub
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="px-4 py-2.5 rounded font-mono text-[11px] font-bold uppercase tracking-[0.05em] transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                        style={{ background: c.primaryContainer, color: c.onPrimaryContainer }}
                    >
                        {savingProfile && (
                            <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        )}
                        {savingProfile ? "Saving..." : "Save changes"}
                    </button>
                </GlassPanel>

                {/* GitHub Integration — bento grid, matches Stitch's 2/3 + 1/3 split */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassPanel className="md:col-span-2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded flex items-center justify-center border"
                                        style={{ background: c.surfaceContainerHighest, borderColor: c.outlineVariant }}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-7 h-7" style={{ fill: c.onSurface }}>
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-[20px] leading-7 font-semibold" style={{ color: c.onSurface }}>
                                            GitHub Connection
                                        </h3>
                                        <p className="text-xs leading-[18px]" style={{ color: c.onSurfaceVariant }}>
                                            {githubConnected ? "Access token active" : "No account connected"}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className="px-2 py-1 rounded font-mono text-[11px] font-semibold uppercase tracking-[0.05em] border"
                                    style={
                                        githubConnected
                                            ? { background: "rgba(195,245,255,0.1)", color: c.primary, borderColor: "rgba(195,245,255,0.2)" }
                                            : { background: "rgba(255,180,171,0.1)", color: c.error, borderColor: "rgba(255,180,171,0.2)" }
                                    }
                                >
                                    {githubConnected ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <p className="text-sm leading-5 mb-6" style={{ color: c.onSurfaceVariant }}>
                                Connect GitHub to sync repositories, pull requests, and commit activity into DevForge.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReconnectGithub}
                                className="px-4 py-2 rounded font-mono text-[11px] font-semibold uppercase tracking-[0.05em] border transition-colors hover:bg-white/5"
                                style={{ borderColor: c.outlineVariant, color: c.onSurface }}
                            >
                                {githubConnected ? "Reconnect" : "Connect GitHub"}
                            </button>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="flex flex-col justify-center items-center text-center">
                        <div className="relative w-20 h-20 mb-4">
                            <div
                                className="absolute inset-0 rounded-full animate-pulse"
                                style={{ background: "rgba(195,245,255,0.1)" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[40px]" style={{ color: c.primary }}>
                                    verified_user
                                </span>
                            </div>
                        </div>
                        <h4 className="text-[20px] leading-7 font-semibold" style={{ color: c.onSurface }}>
                            Status
                        </h4>
                        <p className="text-xs leading-[18px] mt-1" style={{ color: c.onSurfaceVariant }}>
                            {githubConnected
                                ? "Your token is valid and syncing."
                                : "Connect GitHub to enable sync."}
                        </p>
                    </GlassPanel>
                </section>

                {/* Notifications */}
                <GlassPanel>
                    <SectionEyebrow icon="notifications" title="Notifications" />
                    <ToggleRow
                        label="Analysis complete"
                        description="Get notified when a repository analysis finishes."
                        checked={notifyAnalysis}
                        onChange={setNotifyAnalysis}
                    />
                    <ToggleRow
                        label="Security vulnerabilities"
                        description="Alert me when critical or high vulnerabilities are found."
                        checked={notifySecurity}
                        onChange={setNotifySecurity}
                    />
                    <ToggleRow
                        label="Weekly digest"
                        description="A summary of activity across all pinned repositories."
                        checked={notifyWeekly}
                        onChange={setNotifyWeekly}
                    />
                </GlassPanel>

                {/* Appearance */}
                <GlassPanel className="space-y-4">
                    <SectionEyebrow icon="palette" title="Appearance" />
                    <div className="flex gap-2">
                        {(["dark", "light", "system"] as const).map((option) => {
                            const active = theme === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => setTheme(option)}
                                    className="px-4 py-2 rounded-lg font-mono text-[11px] font-semibold uppercase tracking-[0.05em] border capitalize transition-colors"
                                    style={
                                        active
                                            ? { background: c.primaryContainer, color: c.onPrimaryContainer, borderColor: c.primaryContainer }
                                            : { background: c.secondaryContainer, color: c.onSurfaceVariant, borderColor: c.outlineVariant }
                                    }
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs leading-[18px]" style={{ color: c.onSurfaceVariant }}>
                        DevForge currently ships with a dark-optimized design; light mode support is planned.
                    </p>
                </GlassPanel>

                {/* Danger Zone */}
                <GlassPanel style={{ borderColor: "rgba(255,180,171,0.4)" } as React.CSSProperties}>
                    <SectionEyebrow icon="warning" title="Danger Zone" tone="danger" />

                    <div
                        className="flex items-center justify-between py-3 border-b"
                        style={{ borderColor: c.outlineVariant }}
                    >
                        <div>
                            <p className="text-sm leading-5" style={{ color: c.onSurface }}>
                                Delete account
                            </p>
                            <p className="text-xs leading-[18px] mt-0.5" style={{ color: c.onSurfaceVariant }}>
                                Permanently remove your account and all associated data.
                            </p>
                        </div>
                        <button
                            onClick={() => setDeleteDialogOpen(true)}
                            className="px-4 py-2 rounded font-mono text-[11px] font-semibold uppercase tracking-[0.05em] transition-opacity hover:opacity-90"
                            style={{ background: c.errorContainer, color: "#ffdad6" }}
                        >
                            Delete account
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                        <div>
                            <p className="text-sm leading-5" style={{ color: c.onSurface }}>
                                Sign out
                            </p>
                            <p className="text-xs leading-[18px] mt-0.5" style={{ color: c.onSurfaceVariant }}>
                                Sign out of DevForge on this device.
                            </p>
                        </div>
                        <button
                            onClick={signOut}
                            className="px-4 py-2 rounded font-mono text-[11px] font-semibold uppercase tracking-[0.05em] transition-opacity hover:opacity-90"
                            style={{ background: c.secondaryContainer, color: c.onSurface }}
                        >
                            Sign out
                        </button>
                    </div>
                </GlassPanel>
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent
                    style={{ background: c.surfaceContainer, borderColor: c.outlineVariant, color: c.onSurface }}
                >
                    <DialogHeader>
                        <DialogTitle style={{ color: c.onSurface }}>Delete your account?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm leading-5" style={{ color: c.onSurfaceVariant }}>
                        This action is permanent and cannot be undone. All pinned repositories, analysis
                        history, and settings will be deleted.
                    </p>
                    <DialogFooter>
                        <button
                            onClick={() => setDeleteDialogOpen(false)}
                            className="px-4 py-2 rounded font-mono text-[11px] font-semibold uppercase tracking-[0.05em]"
                            style={{ background: c.secondaryContainer, color: c.onSurface }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 rounded font-mono text-[11px] font-semibold uppercase tracking-[0.05em]"
                            style={{ background: c.errorContainer, color: "#ffdad6" }}
                        >
                            Yes, delete my account
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}