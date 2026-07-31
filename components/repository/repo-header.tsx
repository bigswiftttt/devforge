import { Star, GitFork, Code2 } from "lucide-react";

interface RepoHeaderProps {
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    primaryLanguage: string | null;
    ownerAvatar: string;
}

export function RepoHeader({
    fullName,
    description,
    stars,
    forks,
    primaryLanguage,
    ownerAvatar,
}: RepoHeaderProps) {
    const [owner, repo] = fullName.split("/");

    return (
        <div className="bg-card border-b border-border p-lg">
            <nav className="flex items-center gap-2 text-body-sm text-muted-foreground mb-md">
                <span>Repositories</span>
                <span>/</span>
                <span>{owner}</span>
                <span>/</span>
                <span className="text-primary font-bold">{repo}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
                <div className="flex items-center gap-lg">
                    <div className="size-16 bg-muted rounded-xl border border-border flex items-center justify-center p-2">
                        <img src={ownerAvatar} alt={owner} className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-headline-lg text-foreground">{repo}</h1>
                            <span className="px-2 py-0.5 bg-muted border border-border rounded text-label-caps text-muted-foreground">
                                Public
                            </span>
                        </div>
                        <p className="text-body-md text-muted-foreground mt-1 max-w-2xl">{description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-md bg-muted p-4 rounded-xl border border-border">
                    <div className="text-center px-4">
                        <div className="flex items-center gap-1 text-primary">
                            <Star className="size-4" />
                            <span className="text-code-md font-bold">{stars.toLocaleString()}</span>
                        </div>
                        <p className="text-label-caps text-muted-foreground uppercase">Stars</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center px-4">
                        <div className="flex items-center gap-1 text-foreground">
                            <GitFork className="size-4" />
                            <span className="text-code-md font-bold">{forks.toLocaleString()}</span>
                        </div>
                        <p className="text-label-caps text-muted-foreground uppercase">Forks</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center px-4">
                        <div className="flex items-center gap-1 text-foreground">
                            <Code2 className="size-4" />
                            <span className="text-code-md font-bold">{primaryLanguage ?? "—"}</span>
                        </div>
                        <p className="text-label-caps text-muted-foreground uppercase">Language</p>
                    </div>
                </div>
            </div>
        </div>
    );
}