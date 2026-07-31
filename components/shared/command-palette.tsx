"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, FolderPlus, Terminal, FileCode, FolderOpen, Package } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRepositoryStore } from "@/store/repository-store";

const staticSuggestions = [
    { icon: Search, label: "Search repository content...", shortcut: "⌘F" },
    { icon: Zap, label: "Run quick analysis", shortcut: "⌘R" },
    { icon: FolderPlus, label: "Onboard new repository", shortcut: "⌘N" },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const currentRepository = useRepositoryStore((s) => s.currentRepository);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!open) setQuery("");
    }, [open]);

    const fileResults = useMemo(() => {
        if (!currentRepository || query.length < 2) return [];
        const q = query.toLowerCase();
        return currentRepository.fileTree.filter((f) => f.path.toLowerCase().includes(q)).slice(0, 6);
    }, [currentRepository, query]);

    const dependencyResults = useMemo(() => {
        if (!currentRepository?.packageJson || query.length < 2) return [];
        const q = query.toLowerCase();
        const allDeps = [
            ...Object.keys(currentRepository.packageJson.dependencies),
            ...Object.keys(currentRepository.packageJson.devDependencies),
        ];
        return allDeps.filter((d) => d.toLowerCase().includes(q)).slice(0, 6);
    }, [currentRepository, query]);

    const showStaticSuggestions = query.length < 2;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 gap-0 top-[20%] translate-y-0">
                <div className="flex items-center border-b border-border p-4 gap-3">
                    <Terminal className="size-5 text-primary" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        placeholder={
                            currentRepository
                                ? `Search files, folders, dependencies in ${currentRepository.fullName}...`
                                : "Type a command or search..."
                        }
                        className="bg-transparent border-none outline-none flex-1 text-headline-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <span className="text-label-caps text-muted-foreground bg-muted px-2 py-1 rounded">
                        ESC
                    </span>
                </div>
                <div className="max-h-[400px] overflow-y-auto py-2">
                    {showStaticSuggestions && (
                        <>
                            <div className="px-4 py-2 text-muted-foreground text-label-caps uppercase">
                                Suggestions
                            </div>
                            {staticSuggestions.map(({ icon: Icon, label, shortcut }) => (
                                <button
                                    key={label}
                                    className="w-full px-4 py-3 hover:bg-muted flex items-center justify-between transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="size-4 text-primary" />
                                        <span className="text-body-md text-foreground">{label}</span>
                                    </div>
                                    <span className="text-body-sm text-muted-foreground">{shortcut}</span>
                                </button>
                            ))}
                        </>
                    )}

                    {!showStaticSuggestions && fileResults.length === 0 && dependencyResults.length === 0 && (
                        <div className="px-4 py-6 text-center text-body-sm text-muted-foreground">
                            No matches found.
                        </div>
                    )}

                    {fileResults.length > 0 && (
                        <>
                            <div className="px-4 py-2 text-muted-foreground text-label-caps uppercase">
                                Files &amp; Folders
                            </div>
                            {fileResults.map((f) => (
                                <div key={f.path} className="w-full px-4 py-3 flex items-center gap-3 text-body-md text-foreground">
                                    {f.type === "directory" ? (
                                        <FolderOpen className="size-4 text-chart-5" />
                                    ) : (
                                        <FileCode className="size-4 text-primary" />
                                    )}
                                    <span className="truncate">{f.path}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {dependencyResults.length > 0 && (
                        <>
                            <div className="px-4 py-2 text-muted-foreground text-label-caps uppercase">
                                Dependencies
                            </div>
                            {dependencyResults.map((dep) => (
                                <button
                                    key={dep}
                                    onClick={() => {
                                        if (currentRepository) {
                                            router.push(
                                                `/dashboard/repositories/${currentRepository.owner}/${currentRepository.repo}/dependencies`,
                                            );
                                            setOpen(false);
                                        }
                                    }}
                                    className="w-full px-4 py-3 hover:bg-muted flex items-center gap-3 text-body-md text-foreground transition-colors"
                                >
                                    <Package className="size-4 text-primary" />
                                    {dep}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}