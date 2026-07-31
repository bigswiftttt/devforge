import { NextResponse } from "next/server";
import { generateRepositoryInsight, type RepositorySummaryInput } from "@/lib/ai/groq";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as RepositorySummaryInput;

        if (!body.fullName) {
            return NextResponse.json({ error: "Missing repository data." }, { status: 400 });
        }

        const insight = await generateRepositoryInsight(body);
        return NextResponse.json(insight);
    } catch (error) {
        console.error("AI insight generation failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate insight." },
            { status: 500 },
        );
    }
}