import { BaseAgent } from "./base.agent";

type SEOPayload = {
    reviewedDraft: string;
    research: {
        keywords?: string[];
    };
};

type SEOResult = {
    optimizedContent: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
};

export class SEOAgent extends BaseAgent<SEOPayload, SEOResult> {
    name = "SEOAgent";

    async run(payload: SEOPayload): Promise<SEOResult> {
        const { reviewedDraft, research } = payload;

        const prompt = `Optimize this article for SEO:

${reviewedDraft}

Keywords to target: ${JSON.stringify(research.keywords || [])}

Return JSON:
{
  "optimizedContent": "the SEO-optimized full article in Markdown",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "meta description under 160 chars",
  "primaryKeyword": "main keyword",
  "secondaryKeywords": ["kw1", "kw2", "kw3"]
}

Return ONLY valid JSON.`;

        const raw = await this.callAI(prompt, 2500);

        const cleaned = raw.replace(/```json|```/g, "").trim();

        return JSON.parse(cleaned);
    }
}