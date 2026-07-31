"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderGit2,
    GitBranch,
    Network,
    FileText,
    Settings,
    Plus,
    BookOpen,
    HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Repositories", href: "/dashboard/repositories", icon: FolderGit2 },
    { label: "Architecture", href: "/dashboard/architecture", icon: GitBranch },
    { label: "Dependencies", href: "/dashboard/dependencies", icon: Network },
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-[280px] shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
            <div className="p-lg flex items-center gap-3">
                <div className="size-10 rounded bg-primary flex items-center justify-center">
                    <GitBranch className="size-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-headline-sm text-sidebar-primary leading-tight">DevForge AI</p>
                    <p className="text-label-caps text-sidebar-foreground/60 uppercase">Enterprise Plan</p>
                </div>
            </div>

            <div className="px-lg mb-md">
                <Button className="w-full gap-2">
                    <Plus className="size-4" />
                    Analyze New Repo
                </Button>
            </div>

            <nav className="flex-1 px-sm space-y-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-md py-3 rounded-lg text-sidebar-foreground/70 transition-colors",
                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                isActive &&
                                "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border-r-2 border-sidebar-primary",
                            )}
                        >
                            <Icon className="size-5" />
                            <span className="text-label-caps uppercase">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-lg border-t border-sidebar-border space-y-1">
                <Link
                    href="#"
                    className="flex items-center gap-3 px-md py-2 text-sidebar-foreground/60 hover:text-sidebar-foreground text-label-caps"
                >
                    <BookOpen className="size-4" />
                    Docs
                </Link>
                <Link
                    href="#"
                    className="flex items-center gap-3 px-md py-2 text-sidebar-foreground/60 hover:text-sidebar-foreground text-label-caps"
                >
                    <HelpCircle className="size-4" />
                    Support
                </Link>
            </div>
        </aside>
    );
}