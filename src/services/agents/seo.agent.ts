import { BaseAgent } from "./base.agent";

export class SEOAgent extends BaseAgent {
    name = "SEOAgent";

    async run(payload: Record<string, unknown>) {
        const { reviewedDraft, research } = payload as { reviewedDraft: string; research: Record<string, unknown> };
        const prompt = `Optimize this article for SEO:

${reviewedDraft}

Keywords to target: ${JSON.stringify((research as { keywords?: string[] }).keywords || [])}

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
        const seo = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return { finalContent: seo.optimizedContent, seoMetadata: seo };
    }
}