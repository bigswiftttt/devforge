import {
    fetchRepoMetadata,
    fetchRepoTree,
    fetchRepoLanguages,
    fetchReadme,
    fetchRecentCommits,
    fetchPackageJson,
    fetchGitignore,
    fetchPackageLock,
} from "@/lib/github/client";
import type { NormalizedRepository, FileNode, LanguageBreakdown, CommitSummary } from "@/types/repository";

export async function parseRepository(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<NormalizedRepository> {
    const metadata = await fetchRepoMetadata(owner, repo, accessToken);

    const [tree, languagesRaw, readme, commitsRaw, packageJsonRaw, gitignoreContent, packageLock] =
        await Promise.all([
            fetchRepoTree(owner, repo, metadata.default_branch, accessToken),
            fetchRepoLanguages(owner, repo, accessToken),
            fetchReadme(owner, repo, accessToken),
            fetchRecentCommits(owner, repo, accessToken),
            fetchPackageJson(owner, repo, accessToken),
            fetchGitignore(owner, repo, accessToken),
            fetchPackageLock(owner, repo, accessToken),
        ]);

    const fileTree: FileNode[] = tree.map((item) => ({
        path: item.path,
        type: item.type === "tree" ? "directory" : "file",
        size: item.size,
        extension: item.type === "blob" ? item.path.split(".").pop() : undefined,
    }));

    const fileCount = fileTree.filter((f) => f.type === "file").length;
    const folderCount = fileTree.filter((f) => f.type === "directory").length;

    const totalBytes = Object.values(languagesRaw).reduce((sum, b) => sum + b, 0);
    const languages: LanguageBreakdown[] = Object.entries(languagesRaw)
        .map(([language, bytes]) => ({
            language,
            bytes,
            percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.bytes - a.bytes);

    const recentCommits: CommitSummary[] = commitsRaw.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        author: c.commit.author.name,
        date: c.commit.author.date,
    }));

    return {
        owner,
        repo,
        fullName: metadata.full_name,
        description: metadata.description,
        defaultBranch: metadata.default_branch,
        stars: metadata.stargazers_count,
        forks: metadata.forks_count,
        primaryLanguage: metadata.language,
        fileTree,
        fileCount,
        folderCount,
        languages,
        readme,
        recentCommits,
        packageJson: packageJsonRaw
            ? {
                name: packageJsonRaw.name as string | undefined,
                version: packageJsonRaw.version as string | undefined,
                dependencies: (packageJsonRaw.dependencies as Record<string, string>) ?? {},
                devDependencies: (packageJsonRaw.devDependencies as Record<string, string>) ?? {},
            }
            : null,
        gitignoreContent,
        packageLock,
    };
}