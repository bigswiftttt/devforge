import Link from "next/link";
import {
    Terminal,
    Link2,
    Search,
    Brain,
    GitBranch,
    FileText,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Top Nav */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-lg h-16 w-full bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-md">
                    <span className="text-headline-sm font-extrabold text-primary tracking-tight">
                        DevForge
                    </span>
                </div>
                <div className="flex items-center gap-md">
                    <Link href="/login" className="text-body-sm text-muted-foreground hover:text-foreground">
                        Sign in
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative flex flex-col items-center justify-center pt-xl px-lg overflow-hidden">
                <div className="relative z-10 max-w-4xl text-center space-y-lg py-xl">
                    <h1 className="text-[48px] md:text-[64px] leading-[1.1] font-extrabold tracking-tight text-foreground">
                        Command Center for <br />
                        your <span className="text-primary">Codebase</span>
                    </h1>

                    <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
                        Navigate complexity with DevForge. Parse repository structure, visualize architecture
                        and dependencies, and get AI-generated engineering insights — all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-md pt-lg">
                        <Link href="/login">
                            <Button size="lg" className="gap-2">
                                <Link2 className="size-4" />
                                Connect GitHub Repository
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Illustrative demo panel — not real data, just showing what the flow looks like */}
                <div className="relative z-10 mb-xl w-full max-w-5xl mx-auto">
                    <div className="bg-card/70 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-border">
                        <div className="flex items-center justify-between bg-muted px-md py-sm border-b border-border">
                            <div className="flex gap-xs">
                                <div className="size-3 rounded-full bg-destructive/40" />
                                <div className="size-3 rounded-full bg-chart-5/40" />
                                <div className="size-3 rounded-full bg-primary/40" />
                            </div>
                            <div className="text-code-sm text-muted-foreground">devforge — repository search</div>
                            <div className="w-8" />
                        </div>
                        <div className="p-lg space-y-md">
                            <div className="flex items-center gap-md p-md bg-muted/50 rounded-lg border border-primary/20">
                                <Search className="size-5 text-primary" />
                                <div className="text-code-md text-foreground">
                                    analyze <span className="text-primary">your-repo</span> --depth architecture
                                </div>
                            </div>
                            <div className="bg-black/40 rounded p-md text-code-sm text-primary/80 space-y-xs border border-border/30">
                                <p>&gt; Fetching repository tree...</p>
                                <p>&gt; Parsing folder structure and languages...</p>
                                <p>&gt; Building dependency graph...</p>
                                <p>&gt; Generating AI insight report...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-xl px-lg max-w-[1200px] mx-auto">
                <div className="text-center mb-xl">
                    <h2 className="text-headline-md text-foreground mb-sm">
                        Engineered for Technical Leaders
                    </h2>
                    <p className="text-body-md text-muted-foreground">
                        Real repository parsing, real visualizations, AI as the enhancement layer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="bg-card/70 border border-border p-lg rounded-xl">
                        <div className="size-12 rounded bg-primary/10 flex items-center justify-center border border-primary/20 mb-md">
                            <Brain className="size-6 text-primary" />
                        </div>
                        <h3 className="text-headline-sm text-foreground mb-sm">AI Insight Reports</h3>
                        <p className="text-body-md text-muted-foreground">
                            Get a structured engineering report — summary, strengths, weaknesses, and
                            suggestions — generated from your repository's real parsed structure.
                        </p>
                    </div>

                    <div className="bg-card/70 border border-border p-lg rounded-xl">
                        <div className="size-12 rounded bg-chart-5/10 flex items-center justify-center border border-chart-5/20 mb-md">
                            <GitBranch className="size-6 text-chart-5" />
                        </div>
                        <h3 className="text-headline-sm text-foreground mb-sm">Architecture Mapping</h3>
                        <p className="text-body-md text-muted-foreground">
                            Interactive, real folder-structure graphs built directly from your repository's
                            file tree — zoom, pan, and explore.
                        </p>
                    </div>

                    <div className="bg-card/70 border border-border p-lg rounded-xl">
                        <div className="size-12 rounded bg-primary/10 flex items-center justify-center border border-primary/20 mb-md">
                            <BarChart3 className="size-6 text-primary" />
                        </div>
                        <h3 className="text-headline-sm text-foreground mb-sm">Engineering Metrics</h3>
                        <p className="text-body-md text-muted-foreground">
                            File counts, folder sizes, and language breakdowns charted clearly — grounded in
                            real parsed data, not guesses.
                        </p>
                    </div>

                    <div className="bg-card/70 border border-border p-lg rounded-xl">
                        <div className="size-12 rounded bg-chart-5/10 flex items-center justify-center border border-chart-5/20 mb-md">
                            <FileText className="size-6 text-chart-5" />
                        </div>
                        <h3 className="text-headline-sm text-foreground mb-sm">Dependency Visualization</h3>
                        <p className="text-body-md text-muted-foreground">
                            See your project's real dependencies and devDependencies mapped as an interactive
                            graph, straight from package.json.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-xl px-lg">
                <div className="max-w-4xl mx-auto bg-card/70 border border-border p-xl rounded-2xl text-center space-y-md">
                    <h2 className="text-headline-lg text-foreground">Ready to Forge Faster?</h2>
                    <p className="text-body-lg text-muted-foreground max-w-[36rem] mx-auto">
                        Connect your GitHub account and analyze your first repository in minutes.
                    </p>
                    <div className="pt-md">
                        <Link href="/login">
                            <Button size="lg" className="gap-2">
                                <Terminal className="size-4" />
                                Connect with GitHub
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-lg px-lg border-t border-border">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-sm">
                    <span className="text-label-caps text-foreground font-extrabold tracking-widest uppercase">
                        DevForge Intelligence
                    </span>
                    <p className="text-body-sm text-muted-foreground">
                        Built with Next.js, Supabase, and Groq.
                    </p>
                </div>
            </footer>
        </div>
    );
}