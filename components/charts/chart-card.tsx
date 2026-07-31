"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    data: { name: string; value: number }[];
    valueFormatter?: (value: number) => string;
}

export function ChartCard({ title, subtitle, data, valueFormatter }: ChartCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-lg">
            <h3 className="text-headline-sm text-foreground">{title}</h3>
            {subtitle && <p className="text-body-sm text-muted-foreground mb-md">{subtitle}</p>}
            <div className="h-64 mt-md">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            width={100}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                color: "var(--foreground)",
                            }}
                            formatter={(value) => {
                                if (typeof value === "number" && valueFormatter) {
                                    return valueFormatter(value);
                                }

                                if (Array.isArray(value)) {
                                    const firstValue = value[0];
                                    if (typeof firstValue === "number" && valueFormatter) {
                                        return valueFormatter(firstValue);
                                    }
                                }

                                return value;
                            }}
                        />
                        <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}