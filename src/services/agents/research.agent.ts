import { BaseAgent } from "./base.agent";

export type ResearchPayload = {
    topic: string;
};

export type ResearchResult = {
    overview: string;
    keyFacts: string[];
    targetAudience: string;
    contentAngles: string[];
    keywords: string[];
};

export class ResearchAgent extends BaseAgent<ResearchPayload, ResearchResult> {
    name = "ResearchAgent";

    async run(payload: ResearchPayload): Promise<ResearchResult> {
        const { topic } = payload;

        const prompt = `Research this topic: "${topic}"

Return ONLY valid JSON...`;

        const raw = await this.callAI(prompt);

        return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
}