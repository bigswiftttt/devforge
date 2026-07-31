import type { PackageJsonSummary } from "@/types/repository";
import type { Node, Edge } from "@xyflow/react";

export interface DependencyNodeData {
    label: string;
    version: string;
    kind: "root" | "dependency" | "devDependency";
}

export function buildDependencyGraph(packageJson: PackageJsonSummary): {
    nodes: Node[];
    edges: Edge[];
} {
    const rootNode: Node = {
        id: "root",
        position: { x: 0, y: 0 },
        data: { label: packageJson.name ?? "package", version: packageJson.version ?? "", kind: "root" },
        type: "dependencyNode",
    };

    const deps = Object.entries(packageJson.dependencies);
    const devDeps = Object.entries(packageJson.devDependencies);

    const allDeps = [
        ...deps.map(([name, version]) => ({ name, version, kind: "dependency" as const })),
        ...devDeps.map(([name, version]) => ({ name, version, kind: "devDependency" as const })),
    ];

    const radius = Math.min(600, 120 + allDeps.length * 8);
    const depNodes: Node[] = allDeps.map((dep, i) => {
        const angle = (i / allDeps.length) * 2 * Math.PI;
        return {
            id: dep.name,
            position: {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            },
            data: { label: dep.name, version: dep.version, kind: dep.kind },
            type: "dependencyNode",
        };
    });

    const edges: Edge[] = allDeps.map((dep) => ({
        id: `root-${dep.name}`,
        source: "root",
        target: dep.name,
    }));

    return { nodes: [rootNode, ...depNodes], edges };
}