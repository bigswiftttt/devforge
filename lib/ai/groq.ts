import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface RepositoryInsight {
    summary: string;
    architectureExplanation: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    observations: string[];
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
}

export async function generateRepositoryInsight(
    input: RepositorySummaryInput,
): Promise<RepositoryInsight> {
    const prompt = `You are analyzing a software repository using structural data already extracted by a parser. Do not invent facts beyond what the data implies. Respond with ONLY valid JSON, no markdown formatting, no code fences, matching exactly this shape:

{
  "summary": "2-3 sentence high-level summary of what this repository appears to be",
  "architectureExplanation": "2-3 sentences explaining the apparent architecture based on folder structure and language mix",
  "strengths": ["short bullet", "short bullet"],
  "weaknesses": ["short bullet", "short bullet"],
  "suggestions": ["short bullet", "short bullet"],
  "observations": ["short bullet", "short bullet"]
}

Repository data:
${JSON.stringify(input, null, 2)}`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    try {
        return JSON.parse(raw) as RepositoryInsight;
    } catch {
        throw new Error("AI returned an unexpected response format. Try again.");
    }
}