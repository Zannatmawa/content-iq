import { BaseAgent } from "./base.agent";

export class WriterAgent extends BaseAgent {
    name = "WriterAgent";

    async run(payload: Record<string, unknown>) {
        const { outline, research, tone, audience } = payload as { outline: Record<string, unknown>; research: Record<string, unknown>; tone: string; audience: string };
        const prompt = `Write a complete blog article based on:

Outline: ${JSON.stringify(outline, null, 2)}
Research: ${JSON.stringify(research, null, 2)}
Tone: ${tone}
Audience: ${audience}

Write the full article in Markdown format. Make it engaging, informative, and approximately 800-1000 words. Include the title as an H1 heading.`;

        const draft = await this.callAI(prompt, 2000);
        return { draft, outline };
    }
}