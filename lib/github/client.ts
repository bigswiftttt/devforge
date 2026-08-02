export interface GithubRepoMetadata {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    default_branch: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface GithubTreeItem {
    path: string;
    type: "blob" | "tree";
    size?: number;
}

interface GithubCommit {
    sha: string;
    commit: {
        message: string;
        author: { name: string; date: string };
    };
}

function githubHeaders(accessToken: string) {
    return {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
    };
}

async function githubFetch<T>(url: string, accessToken: string): Promise<T> {
    const res = await fetch(url, { headers: githubHeaders(accessToken) });
    if (!res.ok) {
        if (res.status === 404) throw new Error("Not found on GitHub.");
        if (res.status === 403) throw new Error("GitHub API rate limit reached or access denied.");
        throw new Error(`GitHub API error: ${res.status}`);
    }
    return res.json();
}

export async function fetchRepoMetadata(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<GithubRepoMetadata> {
    return githubFetch(`https://api.github.com/repos/${owner}/${repo}`, accessToken);
}

export async function fetchRepoTree(
    owner: string,
    repo: string,
    branch: string,
    accessToken: string,
): Promise<GithubTreeItem[]> {
    const data = await githubFetch<{ tree: GithubTreeItem[]; truncated: boolean }>(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        accessToken,
    );
    return data.tree;
}

export async function fetchRepoLanguages(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<Record<string, number>> {
    return githubFetch(`https://api.github.com/repos/${owner}/${repo}/languages`, accessToken);
}

export async function fetchReadme(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<string | null> {
    try {
        const data = await githubFetch<{ content: string; encoding: string }>(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            accessToken,
        );
        if (data.encoding === "base64") {
            return Buffer.from(data.content, "base64").toString("utf-8");
        }
        return data.content;
    } catch {
        return null;
    }
}

export async function fetchRecentCommits(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<GithubCommit[]> {
    return githubFetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
        accessToken,
    );
}

export async function fetchPackageJson(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<Record<string, unknown> | null> {
    try {
        const data = await githubFetch<{ content: string; encoding: string }>(
            `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
            accessToken,
        );
        const decoded =
            data.encoding === "base64" ? Buffer.from(data.content, "base64").toString("utf-8") : data.content;
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

export function parseRepoInput(input: string): { owner: string; repo: string } | null {
    const trimmed = input.trim();

    const urlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
    if (urlMatch) {
        return { owner: urlMatch[1], repo: urlMatch[2] };
    }

    const shorthandMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (shorthandMatch) {
        return { owner: shorthandMatch[1], repo: shorthandMatch[2] };
    }

    return null;
}
export async function fetchGitignore(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<string | null> {
    try {
        const data = await githubFetch<{ content: string; encoding: string }>(
            `https://api.github.com/repos/${owner}/${repo}/contents/.gitignore`,
            accessToken,
        );
        return data.encoding === "base64" ? Buffer.from(data.content, "base64").toString("utf-8") : data.content;
    } catch {
        return null;
    }
}

export async function fetchPackageLock(
    owner: string,
    repo: string,
    accessToken: string,
): Promise<Record<string, unknown> | null> {
    try {
        const data = await githubFetch<{ content: string; encoding: string }>(
            `https://api.github.com/repos/${owner}/${repo}/contents/package-lock.json`,
            accessToken,
        );
        const decoded =
            data.encoding === "base64" ? Buffer.from(data.content, "base64").toString("utf-8") : data.content;
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}