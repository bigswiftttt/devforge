"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    FolderGit2,
    GitBranch,
    Network,
    FileText,
    Settings,
    Plus,
    Menu,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Repositories", href: "/dashboard/repositories", icon: FolderGit2 },
    { label: "Architecture", href: "/dashboard/architecture", icon: GitBranch },
    { label: "Dependencies", href: "/dashboard/dependencies", icon: Network },
    { label: "Reports", href: "/dashboard/repositories", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                aria-label="Open navigation menu"
                className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                type="button"
            >
                <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
                <div className="p-lg flex items-center gap-3">
                    <div className="size-10 rounded bg-primary flex items-center justify-center">
                        <GitBranch className="size-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-headline-sm text-sidebar-primary leading-tight">DevForge AI</p>
                        <p className="text-label-caps text-sidebar-foreground/60 uppercase">
                            Enterprise Plan
                        </p>
                    </div>
                </div>

                <div className="px-lg mb-md">
                    <Button
                        className="w-full gap-2"
                        onClick={() => {
                            setOpen(false);
                            router.push("/dashboard/repositories");
                        }}
                    >
                        <Plus className="size-4" />
                        Analyze New Repo
                    </Button>
                </div>

                <nav className="flex-1 px-sm space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setOpen(false)}
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
            </SheetContent>
        </Sheet>
    );
}