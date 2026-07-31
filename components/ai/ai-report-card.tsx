import { Sparkles, TrendingUp, TrendingDown, Lightbulb, Eye } from "lucide-react";
import type { RepositoryInsight } from "@/lib/ai/groq";

interface AIReportCardProps {
    insight: RepositoryInsight;
}

export function AIReportCard({ insight }: AIReportCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-lg border-b border-border flex items-center gap-2 bg-primary/5">
                <Sparkles className="size-5 text-primary" />
                <h3 className="text-headline-sm text-foreground">DevForge AI Insights</h3>
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
            </div>
        </div>
    );
}