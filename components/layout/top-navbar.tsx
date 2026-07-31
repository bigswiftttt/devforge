"use client";

import { Search, Terminal, Bell, Settings } from "lucide-react";
import { UserMenu } from "@/components/shared/user-menu";

export function TopNavbar() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-lg h-16 w-full bg-background/80 backdrop-blur-md border-b border-border">
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search repository..."
                    className="bg-muted border border-border rounded-lg pl-10 pr-4 py-1.5 text-body-sm w-80 focus:outline-none focus:ring-1 focus:ring-ring"
                />
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                    <Terminal className="size-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                    <Bell className="size-5" />
                </button>
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                    <Settings className="size-5" />
                </button>
                <UserMenu />
            </div>
        </header>
    );
}