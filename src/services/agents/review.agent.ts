import { BaseAgent } from "./base.agent";

export type ReviewPayload = {
    draft: string;
};

export type ReviewResult = {
    improvedDraft: string;
    changes: string[];
    qualityScore: number;
    readabilityScore: number;
};

export class ReviewAgent extends BaseAgent<ReviewPayload, ReviewResult> {
    name = "ReviewAgent";

    async run(payload: ReviewPayload): Promise<ReviewResult> {
        const { draft } = payload;

        const prompt = `Review this blog post draft:

${draft}

Return JSON:
{
  "improvedDraft": "...",
  "changes": [],
  "qualityScore": 85,
  "readabilityScore": 90
}`;

        const raw = await this.callAI(prompt, 2500);

        return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
}