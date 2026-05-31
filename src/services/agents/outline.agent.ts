import { BaseAgent } from "./base.agent";

export class OutlineAgent extends BaseAgent {
    name = "OutlineAgent";

    async run(payload: Record<string, unknown>) {
        const { research, topic, tone, audience } = payload as { research: Record<string, unknown>; topic: string; tone: string; audience: string };
        const prompt = `Based on this research about "${topic}":
${JSON.stringify(research, null, 2)}

Create a detailed blog post outline for audience: ${audience}, tone: ${tone}

Return JSON:
{
  "title": "compelling blog title",
  "hook": "opening hook sentence",
  "sections": [
    { "heading": "section title", "points": ["point1", "point2"] }
  ],
  "conclusion": "conclusion approach",
  "cta": "call to action"
}

Return ONLY valid JSON.`;

        const raw = await this.callAI(prompt);
        const outline = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return { outline, research, topic, tone, audience };
    }
}