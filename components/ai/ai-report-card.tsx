import { Sparkles, TrendingUp, TrendingDown, Lightbulb, Eye, ShieldAlert, ShieldCheck } from "lucide-react";
import type { RepositoryInsight } from "@/lib/ai/groq";
import { cn } from "@/lib/utils";

interface AIReportCardProps {
    insight: RepositoryInsight;
}

const SEVERITY_STYLES: Record<string, string> = {
    critical: "text-destructive bg-destructive/10 border-destructive/30",
    high: "text-destructive bg-destructive/10 border-destructive/30",
    moderate: "text-chart-5 bg-chart-5/10 border-chart-5/30",
    warning: "text-chart-5 bg-chart-5/10 border-chart-5/30",
    low: "text-muted-foreground bg-muted border-border",
    info: "text-muted-foreground bg-muted border-border",
};

function scoreColor(score: number): string {
    if (score >= 80) return "text-primary";
    if (score >= 50) return "text-chart-5";
    return "text-destructive";
}

export function AIReportCard({ insight }: AIReportCardProps) {
    const hasFindings = insight.vulnerabilities.length > 0 || insight.hygieneFindings.length > 0;

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-lg border-b border-border flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <h3 className="text-headline-sm text-foreground">DevForge AI Insights</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn("text-headline-sm font-bold", scoreColor(insight.score))}>
                        {insight.score}
                    </span>
                    <span className="text-label-caps text-muted-foreground uppercase">/ 100</span>
                </div>
            </div>

            <div className="p-lg space-y-lg">
                <div>
                    <h4 className="text-body-md font-bold text-foreground mb-1">Summary</h4>
                    <p className="text-body-sm text-muted-foreground">{insight.summary}</p>
                </div>

                <div>
                    <h4 className="text-body-md font-bold text-foreground mb-1">Architecture</h4>
                    <p className="text-body-sm text-muted-foreground">{insight.architectureExplanation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div>
                        <h4 className="flex items-center gap-2 text-body-md font-bold text-primary mb-2">
                            <TrendingUp className="size-4" />
                            Strengths
                        </h4>
                        <ul className="space-y-1">
                            {insight.strengths.map((s, i) => (
                                <li key={i} className="text-body-sm text-muted-foreground">
                                    • {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-body-md font-bold text-destructive mb-2">
                            <TrendingDown className="size-4" />
                            Weaknesses
                        </h4>
                        <ul className="space-y-1">
                            {insight.weaknesses.map((w, i) => (
                                <li key={i} className="text-body-sm text-muted-foreground">
                                    • {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <h4 className="flex items-center gap-2 text-body-md font-bold text-chart-5 mb-2">
                        <Lightbulb className="size-4" />
                        Suggestions
                    </h4>
                    <ul className="space-y-1">
                        {insight.suggestions.map((s, i) => (
                            <li key={i} className="text-body-sm text-muted-foreground">
                                • {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="flex items-center gap-2 text-body-md font-bold text-foreground mb-2">
                        <Eye className="size-4" />
                        Observations
                    </h4>
                    <ul className="space-y-1">
                        {insight.observations.map((o, i) => (
                            <li key={i} className="text-body-sm text-muted-foreground">
                                • {o}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Security section — real findings, not AI-invented */}
                <div className="border-t border-border pt-lg">
                    <h4 className="flex items-center gap-2 text-body-md font-bold text-foreground mb-2">
                        {hasFindings ? (
                            <ShieldAlert className="size-4 text-destructive" />
                        ) : (
                            <ShieldCheck className="size-4 text-primary" />
                        )}
                        Security
                    </h4>

                    <p className="text-body-sm text-muted-foreground mb-3">{insight.securityNotes}</p>

                    {insight.usedApproximateVersions && insight.vulnerabilities.length > 0 && (
                        <p className="text-code-sm text-muted-foreground italic mb-3">
                            Note: no lockfile was found, so dependency versions were approximated from
                            package.json ranges — findings may not reflect exact installed versions.
                        </p>
                    )}

                    {insight.vulnerabilities.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {insight.vulnerabilities.map((v, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-start justify-between gap-3 rounded-lg border px-md py-sm",
                                        SEVERITY_STYLES[v.severity] ?? SEVERITY_STYLES.low,
                                    )}
                                >
                                    <div>
                                        <p className="text-body-sm font-medium">
                                            {v.packageName}
                                            <span className="text-code-sm font-normal opacity-70">
                                                {" "}
                                                @ {v.installedVersion}
                                            </span>
                                        </p>
                                        <p className="text-code-sm opacity-90">{v.title}</p>
                                    </div>
                                    <span className="text-label-caps uppercase shrink-0 pt-0.5">
                                        {v.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {insight.hygieneFindings.length > 0 && (
                        <div className="space-y-2">
                            {insight.hygieneFindings.map((h, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-start gap-2 rounded-lg border px-md py-sm text-body-sm",
                                        SEVERITY_STYLES[h.severity] ?? SEVERITY_STYLES.info,
                                    )}
                                >
                                    <span>{h.message}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!hasFindings && (
                        <p className="text-body-sm text-primary">
                            No dependency vulnerabilities or hygiene issues detected.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}