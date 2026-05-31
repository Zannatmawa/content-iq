import { prisma } from "@/lib/prisma";
import { TaskType, TaskStatus, ContentStatus } from "@prisma/client";
import { ResearchAgent } from "../agents/research.agent";
import { OutlineAgent } from "../agents/outline.agent";
import { WriterAgent } from "../agents/writer.agent";
import { ReviewAgent } from "../agents/review.agent";
import { SEOAgent } from "../agents/seo.agent";

export async function runBlogWorkflow(contentId: string, params: {
    topic: string;
    tone: string;
    audience: string;
    projectId: string;
}) {
    // Create all tasks upfront
    const taskDefs = [
        { type: TaskType.RESEARCH, agentType: "ResearchAgent", orderIndex: 0 },
        { type: TaskType.OUTLINE, agentType: "OutlineAgent", orderIndex: 1 },
        { type: TaskType.WRITE_DRAFT, agentType: "WriterAgent", orderIndex: 2 },
        { type: TaskType.REVIEW, agentType: "ReviewAgent", orderIndex: 3 },
        { type: TaskType.SEO_OPTIMIZE, agentType: "SEOAgent", orderIndex: 4 },
    ];

    const tasks = await Promise.all(
        taskDefs.map((t) =>
            prisma.task.create({
                data: {
                    ...t,
                    status: TaskStatus.PENDING,
                    projectId: params.projectId,
                    contentId,
                    payload: params,
                },
            })
        )
    );

    await prisma.content.update({
        where: { id: contentId },
        data: { status: ContentStatus.GENERATING },
    });

    const agents = [
        new ResearchAgent(),
        new OutlineAgent(),
        new WriterAgent(),
        new ReviewAgent(),
        new SEOAgent(),
    ];

    let context: Record<string, unknown> = { ...params };

    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const task = tasks[i];

        await agent.markTaskInProgress(task.id);

        try {
            const result = await agent.run(context);
            await agent.markTaskCompleted(task.id, result as Record<string, unknown>);
            context = { ...context, ...result };
        } catch (err) {
            const error = err instanceof Error ? err.message : "Unknown error";
            await agent.markTaskFailed(task.id, error);
            await prisma.content.update({
                where: { id: contentId },
                data: { status: ContentStatus.DRAFT },
            });
            throw new Error(`Workflow failed at ${agent.name}: ${error}`);
        }
    }

    const finalContent = (context.finalContent as string) || (context.reviewedDraft as string) || "";
    const seoMetadata = context.seoMetadata as Record<string, unknown> | undefined;

    await prisma.content.update({
        where: { id: contentId },
        data: {
            aiOutput: finalContent,
            status: ContentStatus.REVIEWING,
            metadata: seoMetadata ?? {},
        },
    });

    return { success: true, content: finalContent };
}