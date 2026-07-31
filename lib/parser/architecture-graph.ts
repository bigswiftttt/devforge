import type { FileNode } from "@/types/repository";
import type { Node, Edge } from "@xyflow/react";

export function buildArchitectureGraph(fileTree: FileNode[]): { nodes: Node[]; edges: Edge[] } {
    const topLevelFolders = new Map<string, number>();

    for (const file of fileTree) {
        const parts = file.path.split("/");
        if (parts.length > 1) {
            const topFolder = parts[0];
            topLevelFolders.set(topFolder, (topLevelFolders.get(topFolder) ?? 0) + 1);
        }
    }

    const sortedFolders = Array.from(topLevelFolders.entries()).sort((a, b) => b[1] - a[1]);

    const rootNode: Node = {
        id: "root",
        position: { x: 0, y: 0 },
        data: { label: "Repository Root", count: fileTree.length },
        type: "architectureNode",
    };

    const radius = 280;
    const folderNodes: Node[] = sortedFolders.map(([folder, count], i) => {
        const angle = (i / sortedFolders.length) * 2 * Math.PI;
        return {
            id: folder,
            position: {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            },
            data: { label: folder, count },
            type: "architectureNode",
        };
    });

    const edges: Edge[] = sortedFolders.map(([folder]) => ({
        id: `root-${folder}`,
        source: "root",
        target: folder,
        animated: true,
    }));

    return { nodes: [rootNode, ...folderNodes], edges };
}