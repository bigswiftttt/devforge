"use client";

import { useMemo } from "react";
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
import { buildArchitectureGraph } from "@/lib/parser/architecture-graph";
import type { FileNode } from "@/types/repository";

function ArchitectureNode({ data }: NodeProps<Node<{ label: string; count: number }>>) {
    return (
        <div className="bg-card border border-primary/40 rounded-lg px-4 py-3 shadow-[var(--shadow-glow)] min-w-[120px] text-center">
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <p className="text-body-md font-bold text-foreground">{data.label}</p>
            <p className="text-label-caps text-muted-foreground">{data.count} files</p>
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}

const nodeTypes = { architectureNode: ArchitectureNode };

interface ArchitectureGraphProps {
    fileTree: FileNode[];
}

export function ArchitectureGraphView({ fileTree }: ArchitectureGraphProps) {
    const { nodes, edges } = useMemo(() => buildArchitectureGraph(fileTree), [fileTree]);

    return (
        <div className="h-[600px] w-full bg-background rounded-xl border border-border overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
            >
                <Background gap={40} color="var(--border)" />
                <Controls />
            </ReactFlow>
        </div>
    );
}