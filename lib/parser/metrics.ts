import type { NormalizedRepository } from "@/types/repository";

export interface DirectorySize {
    path: string;
    fileCount: number;
    totalBytes: number;
}

export interface RepositoryMetrics {
    fileCount: number;
    folderCount: number;
    totalSizeBytes: number;
    largestDirectories: DirectorySize[];
    languagePercentages: { language: string; percentage: number }[];
}

export function computeMetrics(repo: NormalizedRepository): RepositoryMetrics {
    const dirSizes = new Map<string, { fileCount: number; totalBytes: number }>();

    for (const file of repo.fileTree) {
        if (file.type !== "file") continue;
        const parts = file.path.split("/");
        const topDir = parts.length > 1 ? parts[0] : "(root)";

        const existing = dirSizes.get(topDir) ?? { fileCount: 0, totalBytes: 0 };
        existing.fileCount += 1;
        existing.totalBytes += file.size ?? 0;
        dirSizes.set(topDir, existing);
    }

    const largestDirectories: DirectorySize[] = Array.from(dirSizes.entries())
        .map(([path, stats]) => ({ path, ...stats }))
        .sort((a, b) => b.totalBytes - a.totalBytes)
        .slice(0, 8);

    const totalSizeBytes = repo.fileTree.reduce((sum, f) => sum + (f.size ?? 0), 0);

    return {
        fileCount: repo.fileCount,
        folderCount: repo.folderCount,
        totalSizeBytes,
        largestDirectories,
        languagePercentages: repo.languages.map((l) => ({
            language: l.language,
            percentage: l.percentage,
        })),
    };
}

export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}