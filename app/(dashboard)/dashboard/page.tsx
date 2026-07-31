import { Timer, ShieldAlert, Copy, PinIcon, Server, Wallet, LineChart } from "lucide-react";
import { MetricCard } from "@/components/metrics/metric-card";
import { RepositoryCard } from "@/components/repository/repository-card";

export default function DashboardPage() {
    return (
        <div className="p-lg lg:p-xl space-y-xl">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-md">
                <div>
                    <p className="text-label-caps text-primary mb-1 uppercase">System Overview</p>
                    <h1 className="text-headline-lg text-foreground tracking-tight">
                        Engineer Intelligence Console
                    </h1>
                </div>
                <div className="flex items-center gap-md bg-muted p-1 rounded-xl border border-border">
                    <button className="px-4 py-2 bg-card text-foreground rounded-lg text-label-caps">
                        Live
                    </button>
                    <button className="px-4 py-2 text-muted-foreground rounded-lg text-label-caps">
                        Historical
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <MetricCard
                    label="Total Analysis Hours"
                    value="1,284.5"
                    icon={Timer}
                    trend="+12% from last month"
                    trendDirection="up"
                    accent="primary"
                />
                <MetricCard
                    label="Security Vulnerabilities"
                    value="08"
                    icon={ShieldAlert}
                    trend="3 Critical, 5 High"
                    trendDirection="down"
                    accent="destructive"
                />
                <MetricCard
                    label="Code Duplication"
                    value="4.2%"
                    icon={Copy}
                    trend="Below target (5.0%)"
                    trendDirection="neutral"
                    accent="tertiary"
                />
            </section>

            <section className="space-y-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                        <PinIcon className="size-5 text-primary" />
                        <h3 className="text-headline-sm text-foreground">Pinned Repositories</h3>
                    </div>
                    <button className="text-primary text-label-caps hover:underline">View All Repos</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-lg">
                    <RepositoryCard
                        name="core-api-gateway"
                        branch="main"
                        language="node-js"
                        icon={Server}
                        healthScore={94}
                        healthColor="primary"
                        insight="Refactoring needed in auth module; potential circular dependency detected."
                        sparklinePath="M0 50 Q50 20 100 45 T200 15 T300 35 T400 10"
                    />
                    <RepositoryCard
                        name="billing-engine-v3"
                        branch="staging"
                        language="go-lang"
                        icon={Wallet}
                        healthScore={62}
                        healthColor="destructive"
                        insight="Major duplication found in data-mapper service. 3 critical security risks."
                        sparklinePath="M0 10 Q50 15 100 40 T200 55 T300 45 T400 58"
                    />
                    <RepositoryCard
                        name="ml-model-pipeline"
                        branch="dev"
                        language="python"
                        icon={LineChart}
                        healthScore={88}
                        healthColor="tertiary"
                        insight="Latency bottleneck in preprocessing script. Upgrade to v2.4 libraries."
                        sparklinePath="M0 40 Q50 35 100 20 T200 25 T300 22 T400 18"
                    />
                </div>
            </section>
        </div>
    );
}