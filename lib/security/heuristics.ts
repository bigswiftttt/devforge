interface FileTreeEntry {
    path: string;
    type: "file" | "directory";
}

export interface HygieneFinding {
    severity: "info" | "warning" | "critical";
    message: string;
}

export function runSecurityHeuristics(
    fileTree: FileTreeEntry[],
    gitignoreContent: string | null,
): HygieneFinding[] {
    const findings: HygieneFinding[] = [];
    const paths = fileTree.map((f) => f.path.toLowerCase());

    // Committed .env files are a real, serious finding — potential secret exposure.
    const hasEnvFile = paths.some(
        (p) => /(^|\/)\.env(\..+)?$/.test(p) && !p.endsWith(".env.example") && !p.endsWith(".env.sample"),
    );
    if (hasEnvFile) {
        const gitignoreCoversEnv = gitignoreContent
            ? /(^|\n)\s*\.env(\*|\..+)?\s*($|\n)/.test(gitignoreContent) || /(^|\n)\s*\.env\s*($|\n)/.test(gitignoreContent)
            : false;

        if (!gitignoreCoversEnv) {
            findings.push({
                severity: "critical",
                message: "A .env file appears to be present in the repository and is not excluded by .gitignore — this can expose secrets if committed.",
            });
        }
    }

    if (!gitignoreContent) {
        findings.push({
            severity: "warning",
            message: "No .gitignore file found — increases risk of accidentally committing secrets or build artifacts.",
        });
    }

    const hasReadme = paths.some((p) => p === "readme.md" || p === "readme");
    if (!hasReadme) {
        findings.push({
            severity: "info",
            message: "No README found — makes onboarding and security review harder for contributors.",
        });
    }

    const hasTests = paths.some(
        (p) => p.includes("__tests__") || p.includes("/test/") || p.includes("/tests/") || /\.(test|spec)\.[jt]sx?$/.test(p),
    );
    if (!hasTests) {
        findings.push({
            severity: "warning",
            message: "No test files detected — reduces confidence that changes are validated before merging.",
        });
    }

    const hasLintConfig = paths.some(
        (p) => p.startsWith(".eslintrc") || p === "eslint.config.js" || p === "eslint.config.mjs" || p === "eslint.config.ts",
    );
    if (!hasLintConfig) {
        findings.push({
            severity: "info",
            message: "No ESLint configuration found — static analysis for common bugs and unsafe patterns may not be enforced.",
        });
    }

    return findings;
}