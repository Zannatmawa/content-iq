import { BaseAgent } from "./base.agent";

export class ReviewAgent extends BaseAgent {
    name = "ReviewAgent";

    async run(payload: Record<string, unknown>) {
        const { draft } = payload as { draft: string };
        const prompt = `Review this blog post draft and provide improvements:

${draft}

Return JSON:
{
  "improvedDraft": "the improved version of the full article in Markdown",
  "changes": ["change1", "change2", "change3"],
  "qualityScore": 85,
  "readabilityScore": 90
}

Return ONLY valid JSON.`;

        const raw = await this.callAI(prompt, 2500);
        const review = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return { reviewedDraft: review.improvedDraft, review };
    }
}
