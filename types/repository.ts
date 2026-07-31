export interface FileNode {
    path: string;
    type: "file" | "directory";
    size?: number;
    extension?: string;
}

export interface LanguageBreakdown {
    language: string;
    bytes: number;
    percentage: number;
}

export interface CommitSummary {
    sha: string;
    message: string;
    author: string;
    date: string;
}

export interface PackageJsonSummary {
    name?: string;
    version?: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}

export interface NormalizedRepository {
    owner: string;
    repo: string;
    fullName: string;
    description: string | null;
    defaultBranch: string;
    stars: number;
    forks: number;
    primaryLanguage: string | null;
    fileTree: FileNode[];
    fileCount: number;
    folderCount: number;
    languages: LanguageBreakdown[];
    readme: string | null;
    recentCommits: CommitSummary[];
    packageJson: PackageJsonSummary | null;
}