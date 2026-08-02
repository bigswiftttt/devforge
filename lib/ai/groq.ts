import Groq from "groq-sdk";
import type { VulnerabilityFinding } from "@/lib/security/npm-audit";
import type { HygieneFinding } from "@/lib/security/heuristics";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface RepositoryInsight {
    summary: string;
    architectureExplanation: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    observations: string[];
    securityNotes: string;
    vulnerabilities: VulnerabilityFinding[];
    hygieneFindings: HygieneFinding[];
    score: number;
    usedApproximateVersions: boolean;
}

export interface RepositorySummaryInput {
    fullName: string;
    description: string | null;
    primaryLanguage: string | null;
    fileCount: number;
    folderCount: number;
    languages: { language: string; percentage: number }[];
    topLevelFolders: string[];
    dependencyCount: number;
    devDependencyCount: number;
    recentCommitMessages: string[];
    vulnerabilities: VulnerabilityFinding[];
    hygieneFindings: HygieneFinding[];
    usedApproximateVersions: boolean;
}

const SEVERITY_WEIGHT: Record<string, number> = {
    critical: 25,
    high: 15,
    moderate: 8,
    low: 3,
};

const HYGIENE_WEIGHT: Record<string, number> = {
    critical: 20,
    warning: 8,
    info: 2,
};

/**
 * Computes a deterministic 0-100 health score based on real findings.
 * This is intentionally NOT delegated to the LLM — security scoring should
 * be reproducible and auditable, not subject to model variance.
 */
function computeScore(vulnerabilities: VulnerabilityFinding[], hygieneFindings: HygieneFinding[]): number {
    let score = 100;
    for (const v of vulnerabilities) {
        score -= SEVERITY_WEIGHT[v.severity] ?? 5;
    }
    for (const h of hygieneFindings) {
        score -= HYGIENE_WEIGHT[h.severity] ?? 2;
    }
    return Math.max(0, Math.min(100, Math.round(score)));
}

export async function generateRepositoryInsight(
    input: RepositorySummaryInput,
): Promise<RepositoryInsight> {
    const score = computeScore(input.vulnerabilities, input.hygieneFindings);

    const prompt = `You are analyzing a software repository using structural data already extracted by a parser, plus real security findings from npm's advisory database and repository hygiene checks. Do not invent facts beyond what the data implies. Do not invent additional vulnerabilities or findings beyond what is listed below — only explain and contextualize the real findings provided. Respond with ONLY valid JSON, no markdown formatting, no code fences, matching exactly this shape:

{
  "summary": "2-3 sentence high-level summary of what this repository appears to be",
  "architectureExplanation": "2-3 sentences explaining the apparent architecture based on folder structure and language mix",
  "strengths": ["short bullet", "short bullet"],
  "weaknesses": ["short bullet", "short bullet"],
  "suggestions": ["short bullet", "short bullet"],
  "observations": ["short bullet", "short bullet"],
  "securityNotes": "2-4 sentences summarizing the real vulnerability and hygiene findings below in plain language, prioritized by severity"
}

Repository data:
${JSON.stringify(
        {
            fullName: input.fullName,
            description: input.description,
            primaryLanguage: input.primaryLanguage,
            fileCount: input.fileCount,
            folderCount: input.folderCount,
            languages: input.languages,
            topLevelFolders: input.topLevelFolders,
            dependencyCount: input.dependencyCount,
            devDependencyCount: input.devDependencyCount,
            recentCommitMessages: input.recentCommitMessages,
        },
        null,
        2,
    )}

Real vulnerability findings (from npm advisory database${input.usedApproximateVersions ? ", versions approximated from package.json ranges since no lockfile was found — mention this caveat if relevant" : ""}):
${JSON.stringify(input.vulnerabilities, null, 2)}

Real hygiene findings:
${JSON.stringify(input.hygieneFindings, null, 2)}`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    try {
        const parsed = JSON.parse(raw) as Omit<
            RepositoryInsight,
            "vulnerabilities" | "hygieneFindings" | "score" | "usedApproximateVersions"
        >;
        return {
            ...parsed,
            vulnerabilities: input.vulnerabilities,
            hygieneFindings: input.hygieneFindings,
            score,
            usedApproximateVersions: input.usedApproximateVersions,
        };
    } catch {
        throw new Error("AI returned an unexpected response format. Try again.");
    }
}