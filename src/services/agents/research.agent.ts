import { BaseAgent } from "./base.agent";

export class ResearchAgent extends BaseAgent {
    name = "ResearchAgent";

    async run(payload: Record<string, unknown>) {
        const { topic } = payload as { topic: string };
        const prompt = `Research this topic thoroughly: "${topic}"
    
    Return a JSON object with:
    {
      "overview": "2-3 paragraph overview",
      "keyFacts": ["fact1", "fact2", "fact3", "fact4", "fact5"],
      "targetAudience": "description of ideal audience",
      "contentAngles": ["angle1", "angle2", "angle3"],
      "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8", "kw9", "kw10"]
    }
    
    Return ONLY valid JSON, no markdown.`;

        const raw = await this.callAI(prompt);
        const research = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return { research, topic };
    }
}