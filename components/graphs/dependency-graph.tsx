"use client";

import { useMemo, useState } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    type Node,
    type NodeProps,
    Handle,
    Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { buildDependencyGraph, type DependencyNodeData } from "@/lib/parser/dependency-graph";
import type { PackageJsonSummary } from "@/types/repository";
import { cn } from "@/lib/utils";

function DependencyNode({ data }: NodeProps<Node<DependencyNodeData & Record<string, unknown>>>) {
    const isRoot = data.kind === "root";
    const isDev = data.kind === "devDependency";

    return (
        <div
            className={cn(
                "rounded-lg px-3 py-2 text-center border min-w-[100px]",
                isRoot && "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]",
                !isRoot && !isDev && "bg-card border-border",
                isDev && "bg-muted border-border opacity-70",
            )}
        >
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <p className="text-code-sm font-bold truncate max-w-[140px]">{data.label}</p>
            {data.version && <p className="text-label-caps opacity-70">{data.version}</p>}
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}

const nodeTypes = { dependencyNode: DependencyNode };

interface DependencyGraphProps {
    packageJson: PackageJsonSummary;
}

export function DependencyGraphView({ packageJson }: DependencyGraphProps) {
    const { nodes, edges } = useMemo(() => buildDependencyGraph(packageJson), [packageJson]);
    const [selected, setSelected] = useState<DependencyNodeData | null>(null);

    const depCount = Object.keys(packageJson.dependencies).length;
    const devDepCount = Object.keys(packageJson.devDependencies).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
            <div className="lg:col-span-3 h-[600px] bg-background rounded-xl border border-border overflow-hidden">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={{ hideAttribution: true }}
                    onNodeClick={(_, node) => setSelected(node.data as unknown as DependencyNodeData)}
                >
                    <Background gap={40} color="var(--border)" />
                    <Controls />
                </ReactFlow>
            </div>

            <div className="space-y-md">
                <div className="bg-card border border-border rounded-xl p-lg">
                    <h3 className="text-headline-sm text-foreground mb-md">Graph Summary</h3>
                    <div className="grid grid-cols-2 gap-md">
                        <div>
                            <p className="text-label-caps text-muted-foreground">Dependencies</p>
                            <p className="text-headline-sm text-primary">{depCount}</p>
                        </div>
                        <div>
                            <p className="text-label-caps text-muted-foreground">Dev Dependencies</p>
                            <p className="text-headline-sm text-foreground">{devDepCount}</p>
                        </div>
                    </div>
                </div>

                {selected && (
                    <div className="bg-card border border-border rounded-xl p-lg">
                        <h3 className="text-headline-sm text-primary mb-1">{selected.label}</h3>
                        <p className="text-body-sm text-muted-foreground mb-md">{selected.version}</p>
                        <span className="text-label-caps text-muted-foreground uppercase">
                            {selected.kind === "devDependency" ? "Dev Dependency" : "Dependency"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}