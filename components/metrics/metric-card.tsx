import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendDirection?: "up" | "down" | "neutral";
    accent?: "primary" | "destructive" | "tertiary";
}

export function MetricCard({
    label,
    value,
    icon: Icon,
    trend,
    trendDirection = "neutral",
    accent = "primary",
}: MetricCardProps) {
    const accentClasses = {
        primary: "text-primary bg-primary/10",
        destructive: "text-destructive bg-destructive/10",
        tertiary: "text-chart-5 bg-chart-5/10",
    };

    const trendClasses = {
        up: "text-primary",
        down: "text-destructive",
        neutral: "text-muted-foreground",
    };

    return (
        <div className="bg-card border border-border rounded-xl p-lg">
            <div className="flex justify-between items-start mb-md">
                <div>
                    <p className="text-label-caps text-muted-foreground uppercase">{label}</p>
                    <h2 className="text-headline-md text-foreground mt-1">{value}</h2>
                </div>
                <span className={cn("p-2 rounded-lg", accentClasses[accent])}>
                    <Icon className="size-5" />
                </span>
            </div>
            {trend && (
                <div className={cn("flex items-center gap-2 text-body-sm", trendClasses[trendDirection])}>
                    {trend}
                </div>
            )}
        </div>
    );
}