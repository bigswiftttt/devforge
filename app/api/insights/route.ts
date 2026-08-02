import { NextResponse } from "next/server";
import { generateRepositoryInsight, type RepositorySummaryInput } from "@/lib/ai/groq";
import { checkNpmAdvisories } from "@/lib/security/npm-audit";
import { runSecurityHeuristics } from "@/lib/security/heuristics";

interface InsightRequestBody {
    fullName: string;
    description: string | null;
    primaryLanguage: string | null;
    fileCount: number;
    folderCount: number;
    languages: { language: string; percentage: number }[];
    topLevelFolders: string[];
    recentCommitMessages: string[];
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    fileTree: { path: string; type: "file" | "directory" }[];
    gitignoreContent: string | null;
    packageLock: Record<string, unknown> | null;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as InsightRequestBody;

        if (!body.fullName) {
            return NextResponse.json({ error: "Missing repository data." }, { status: 400 });
        }

        const { findings: vulnerabilities, usedApproximateVersions } = await checkNpmAdvisories(
            body.dependencies ?? {},
            body.devDependencies ?? {},
            body.packageLock,
        );

        const hygieneFindings = runSecurityHeuristics(body.fileTree ?? [], body.gitignoreContent);

        const insightInput: RepositorySummaryInput = {
            fullName: body.fullName,
            description: body.description,
            primaryLanguage: body.primaryLanguage,
            fileCount: body.fileCount,
            folderCount: body.folderCount,
            languages: body.languages,
            topLevelFolders: body.topLevelFolders,
            dependencyCount: Object.keys(body.dependencies ?? {}).length,
            devDependencyCount: Object.keys(body.devDependencies ?? {}).length,
            recentCommitMessages: body.recentCommitMessages,
            vulnerabilities,
            hygieneFindings,
            usedApproximateVersions,
        };

        const insight = await generateRepositoryInsight(insightInput);
        return NextResponse.json(insight);
    } catch (error) {
        console.error("AI insight generation failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate insight." },
            { status: 500 },
        );
    }
}