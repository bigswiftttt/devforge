"use client";

import { useRouter } from "next/navigation";
import { Search, Terminal, Bell, Settings } from "lucide-react";
import { UserMenu } from "@/components/shared/user-menu";
import { useCommandPaletteStore } from "@/store/command-palette-store";
import { MobileNav } from "@/components/layout/mobile-nav";

export function TopNavbar() {
    const router = useRouter();
    const openCommandPalette = useCommandPaletteStore((s) => s.open);

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-lg h-16 w-full bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-md">
                <MobileNav />
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search repository..."
                        aria-label="Search repository (opens command palette)"
                        onFocus={openCommandPalette}
                        readOnly
                        className="bg-muted border border-border rounded-lg pl-10 pr-4 py-1.5 text-body-sm w-80 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={openCommandPalette}
                    className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    aria-label="Open command palette"
                    title="Command palette (⌘K)"
                >
                    <Terminal className="size-5" />
                </button>
                <button
                    className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    aria-label="Notifications (coming soon)"
                    title="Notifications (coming soon)"
                    disabled
                >
                    <Bell className="size-5" />
                </button>
                <button
                    onClick={() => router.push("/dashboard/settings")}
                    className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    aria-label="Settings"
                    title="Settings"
                >
                    <Settings className="size-5" />
                </button>
                <UserMenu />
            </div>
        </header>
    );
}