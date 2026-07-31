import { type LucideIcon, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositoryCardProps {
    name: string;
    branch: string;
    language: string;
    icon: LucideIcon;
    healthScore: number;
    healthColor: "primary" | "destructive" | "tertiary";
    insight: string;
    sparklinePath: string;
}

export function RepositoryCard({
    name,
    branch,
    language,
    icon: Icon,
    healthScore,
    healthColor,
    insight,
    sparklinePath,
}: RepositoryCardProps) {
    const borderColor = {
        primary: "border-l-primary",
        destructive: "border-l-destructive",
        tertiary: "border-l-chart-5",
    };

    const textColor = {
        primary: "text-primary",
        destructive: "text-destructive",
        tertiary: "text-chart-5",
    };

    return (
        <div
            className={cn(
                "bg-card border border-border rounded-xl p-lg border-l-4 cursor-pointer transition-colors hover:border-border/60",
                borderColor[healthColor],
            )}
        >
            <div className="flex items-center justify-between mb-lg gap-md">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 bg-muted rounded flex items-center justify-center shrink-0">
                        <Icon className={cn("size-5", textColor[healthColor])} />
                    </div>
                    <div className="min-w-0">
                        <h4
                            className="text-body-lg font-bold text-foreground truncate"
                            title={name}
                        >
                            {name}
                        </h4>
                        <p className="text-code-sm text-muted-foreground truncate">
                            {branch} · {language}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <span className={cn("text-code-md", textColor[healthColor])}>{healthScore}%</span>
                    <span className="text-label-caps text-muted-foreground uppercase whitespace-nowrap">
                        Health Score
                    </span>
                </div>
            </div>

            <div className="mb-lg h-16 w-full bg-background rounded overflow-hidden">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 64">
                    <path
                        d={sparklinePath}
                        fill="none"
                        stroke={`var(--${healthColor === "primary" ? "primary" : healthColor === "destructive" ? "destructive" : "chart-5"})`}
                        strokeWidth="2"
                    />
                </svg>
            </div>

            <div className="bg-muted p-md rounded-lg border border-border">
                <div className={cn("flex items-center gap-2 mb-2", textColor[healthColor])}>
                    <Brain className="size-4" />
                    <span className="text-label-caps uppercase">AI Insight</span>
                </div>
                <p className="text-body-sm text-foreground italic">&quot;{insight}&quot;</p>
            </div>
        </div>
    );
}