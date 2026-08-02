interface Advisory {
    id: number;
    title: string;
    severity: "low" | "moderate" | "high" | "critical";
    url: string;
    vulnerable_versions: string;
}

export interface VulnerabilityFinding {
    packageName: string;
    installedVersion: string;
    severity: Advisory["severity"];
    title: string;
    url: string;
}

/**
 * Extracts exact resolved versions from an npm package-lock.json (v2/v3 format).
 * Returns an empty map if the lockfile is missing or in an unrecognized format.
 */
function extractLockfileVersions(lock: Record<string, unknown> | null): Record<string, string> {
    if (!lock) return {};
    const packages = lock.packages as Record<string, { version?: string }> | undefined;
    if (!packages) return {};

    const versions: Record<string, string> = {};
    for (const [path, meta] of Object.entries(packages)) {
        if (!path.startsWith("node_modules/") || !meta.version) continue;
        const name = path.replace("node_modules/", "");
        if (!name.includes("node_modules/")) {
            versions[name] = meta.version;
        }
    }
    return versions;
}

/**
 * Best-effort version resolution when no lockfile is present: strips range
 * operators (^, ~, >=, etc.) from a package.json version string. This is an
 * approximation, not an exact installed version — callers should treat results
 * from this path as lower-confidence.
 */
function approximateVersion(range: string): string {
    return range.replace(/^[\^~>=<]+/, "").trim();
}

/**
 * Checks a set of dependencies against npm's public security advisory database.
 * Uses exact lockfile versions when available, falling back to approximated
 * versions from package.json ranges otherwise.
 */
export async function checkNpmAdvisories(
    dependencies: Record<string, string>,
    devDependencies: Record<string, string>,
    lockfile: Record<string, unknown> | null,
): Promise<{ findings: VulnerabilityFinding[]; usedApproximateVersions: boolean }> {
    const lockVersions = extractLockfileVersions(lockfile);
    const usedApproximateVersions = Object.keys(lockVersions).length === 0;

    const allDeps = { ...dependencies, ...devDependencies };
    const payload: Record<string, string[]> = {};

    for (const [name, range] of Object.entries(allDeps)) {
        const version = lockVersions[name] ?? approximateVersion(range);
        if (version) payload[name] = [version];
    }

    if (Object.keys(payload).length === 0) {
        return { findings: [], usedApproximateVersions };
    }

    try {
        const res = await fetch("https://registry.npmjs.org/-/npm/v1/security/advisories/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            return { findings: [], usedApproximateVersions };
        }

        const data = (await res.json()) as Record<string, Advisory[]>;
        const findings: VulnerabilityFinding[] = [];

        for (const [packageName, advisories] of Object.entries(data)) {
            for (const advisory of advisories) {
                findings.push({
                    packageName,
                    installedVersion: payload[packageName]?.[0] ?? "unknown",
                    severity: advisory.severity,
                    title: advisory.title,
                    url: advisory.url,
                });
            }
        }

        return { findings, usedApproximateVersions };
    } catch {
        return { findings: [], usedApproximateVersions };
    }
}