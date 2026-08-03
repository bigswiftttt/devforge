"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderGit2,
    GitBranch,
    Network,
    BarChart3,
    FileText,
    Settings,
    Plus,
    BookOpen,
    HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRepositoryStore } from "@/store/repository-store";

interface MobileNavProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
    const pathname = usePathname();
    const currentRepository = useRepositoryStore((s) => s.currentRepository);

    const repoBase = currentRepository
        ? `/dashboard/repositories/${currentRepository.owner}/${currentRepository.repo}`
        : null;

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Repositories", href: "/dashboard/repositories", icon: FolderGit2 },
        { label: "Architecture", href: repoBase ? `${repoBase}/architecture` : null, icon: GitBranch },
        { label: "Dependencies", href: repoBase ? `${repoBase}/dependencies` : null, icon: Network },
        { label: "Metrics", href: repoBase ? `${repoBase}/metrics` : null, icon: BarChart3 },
        { label: "Reports", href: repoBase ? `${repoBase}/report` : null, icon: FileText },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
                <div className="flex flex-col h-full">
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
                        <Link href="/dashboard/repositories" onClick={() => onOpenChange(false)}>
                            <Button className="w-full gap-2">
                                <Plus className="size-4" />
                                Analyze New Repo
                            </Button>
                        </Link>
                    </div>

                    <nav className="flex-1 px-sm space-y-1 overflow-y-auto">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = href !== null && pathname === href;
                            const isDisabled = href === null;

                            if (isDisabled) {
                                return (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 px-md py-3 rounded-lg text-sidebar-foreground/30 cursor-not-allowed select-none"
                                    >
                                        <Icon className="size-5" />
                                        <span className="text-label-caps uppercase">{label}</span>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={() => onOpenChange(false)}
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
                </div>
            </SheetContent>
        </Sheet>
    );
}