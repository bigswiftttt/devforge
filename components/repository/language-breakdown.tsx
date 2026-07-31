interface LanguageBreakdownProps {
    languages: { language: string; percentage: number }[];
}

const colorClasses = [
    "bg-primary",
    "bg-chart-5",
    "bg-chart-2",
    "bg-destructive",
    "bg-muted-foreground",
];

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-lg">
            <h3 className="text-headline-sm text-foreground mb-md">Language Breakdown</h3>

            <div className="flex h-2 rounded-full overflow-hidden mb-md">
                {languages.map((lang, i) => (
                    <div
                        key={lang.language}
                        className={colorClasses[i % colorClasses.length]}
                        style={{ width: `${lang.percentage}%` }}
                    />
                ))}
            </div>

            <div className="space-y-2">
                {languages.slice(0, 6).map((lang, i) => (
                    <div key={lang.language} className="flex items-center justify-between text-body-sm">
                        <div className="flex items-center gap-2">
                            <span className={`size-2 rounded-full ${colorClasses[i % colorClasses.length]}`} />
                            <span className="text-foreground">{lang.language}</span>
                        </div>
                        <span className="text-muted-foreground">{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}