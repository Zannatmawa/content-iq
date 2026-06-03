import { BaseAgent } from "./base.agent";

export type OutlinePayload = {
  research: any;
  topic: string;
  tone: string;
  audience: string;
};

export type OutlineResult = {
  title: string;
  hook: string;
  sections: {
    heading: string;
    points: string[];
  }[];
  conclusion: string;
  cta: string;
};

export class OutlineAgent extends BaseAgent<OutlinePayload, OutlineResult> {
  name = "OutlineAgent";

  async run(payload: OutlinePayload): Promise<OutlineResult> {
    const { research, topic, tone, audience } = payload;

    const prompt = `Based on this research about "${topic}":

${JSON.stringify(research, null, 2)}

Create a blog outline...

Return ONLY valid JSON.`;

    const raw = await this.callAI(prompt);

    const cleaned = raw.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  }
}