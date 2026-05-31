import { openai } from "./openai";
import {
    buildBlogPrompt,
    buildEmailPrompt,
    buildSocialPostPrompt,
    buildResearchPrompt,
    buildSEOPrompt,
} from "./prompts";

export type GenerateParams =
    | { type: "blog"; topic: string; audience: string; tone: string; keywords?: string; wordCount?: number }
    | { type: "email"; emailType: "cold_email" | "newsletter" | "follow_up" | "onboarding"; subject: string; audience: string; goal: string; tone: string }
    | { type: "social_post"; platform: "linkedin" | "twitter" | "facebook" | "instagram"; topic: string; tone: string; includeHashtags: boolean }
    | { type: "research"; topic: string }
    | { type: "seo"; content: string };

export async function generateContent(params: GenerateParams): Promise<string> {
    let prompt: string = "";

    if (params.type === "blog") {
        prompt = buildBlogPrompt(params);
    } else if (params.type === "social_post") {
        prompt = buildSocialPostPrompt(params);
    } else if (params.type === "research") {
        prompt = buildResearchPrompt(params.topic);
    } else if (params.type === "seo") {
        prompt = buildSEOPrompt(params.content);
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("OpenAI returned empty response");
    }

    return content;
}

// re-export prompt builders
export {
    buildBlogPrompt,
    buildEmailPrompt,
    buildSocialPostPrompt,
    buildResearchPrompt,
    buildSEOPrompt,
};