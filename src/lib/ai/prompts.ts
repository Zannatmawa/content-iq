export function buildBlogPrompt(params: {
    topic: string;
    audience: string;
    tone: string;
    keywords?: string;
    wordCount?: number;
}): string {
    return `You are an expert content writer. Write a complete, well-structured blog article with the following specifications:

Topic: ${params.topic}
Target Audience: ${params.audience}
Tone: ${params.tone}
${params.keywords ? `Keywords to include: ${params.keywords}` : ""}
Target word count: ${params.wordCount || 800} words

Requirements:
- Write an engaging title
- Include an introduction, 3-5 main sections with H2 headings, and a conclusion
- Use subheadings (H3) where appropriate
- Write in a natural, human-like style
- Optimize for readability
- End with a clear call-to-action

Return the article in clean Markdown format.`;
}

export function buildEmailPrompt(params: {
    type: "cold_email" | "newsletter" | "follow_up" | "onboarding";
    subject: string;
    audience: string;
    goal: string;
    tone: string;
}): string {
    return `You are an expert email copywriter. Write a ${params.type.replace("_", " ")} email with these specifications:

Subject hint: ${params.subject}
Audience: ${params.audience}
Goal: ${params.goal}
Tone: ${params.tone}

Requirements:
- Write a compelling subject line
- Keep it concise and focused
- Include a clear CTA
- Personalization placeholder: [First Name]

Return in this format:
SUBJECT: [subject line]
BODY:
[email body]`;
}

export function buildSocialPostPrompt(params: {
    platform: "linkedin" | "twitter" | "facebook" | "instagram";
    topic: string;
    tone: string;
    includeHashtags: boolean;
}): string {
    const limits = { linkedin: 3000, twitter: 280, facebook: 500, instagram: 300 };
    return `Write a ${params.platform} post about: ${params.topic}
Tone: ${params.tone}
Character limit: ${limits[params.platform]}
${params.includeHashtags ? "Include 3-5 relevant hashtags." : "No hashtags."}
Make it engaging and native to the ${params.platform} platform format.`;
}

export function buildResearchPrompt(topic: string): string {
    return `Research the following topic and provide a comprehensive briefing:
Topic: ${topic}

Provide:
1. Overview (2-3 paragraphs)
2. Key facts and statistics (5-7 bullet points)
3. Target audience insights
4. Content angles and hooks (3-5 ideas)
5. SEO keyword suggestions (10 keywords)

Be factual and concise.`;
}

export function buildSEOPrompt(content: string): string {
    return `Analyze and optimize the following content for SEO. Return the improved version plus SEO metadata.

Content:
${content}

Provide:
1. SEO-optimized version of the content
2. Meta title (60 chars max)
3. Meta description (160 chars max)
4. Primary keyword
5. Secondary keywords (5)
6. Readability suggestions`;
}
