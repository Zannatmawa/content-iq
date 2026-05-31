import { openai } from "@/lib/ai/openai";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export abstract class BaseAgent {
    abstract name: string;
    abstract run(payload: Record<string, unknown>): Promise<Record<string, unknown>>;

    async markTaskInProgress(taskId: string) {
        return prisma.task.update({
            where: { id: taskId },
            data: { status: TaskStatus.IN_PROGRESS },
        });
    }

    async markTaskCompleted(taskId: string, result: Record<string, unknown>) {
        return prisma.task.update({
            where: { id: taskId },
            data: { status: TaskStatus.COMPLETED, result },
        });
    }

    async markTaskFailed(taskId: string, error: string) {
        return prisma.task.update({
            where: { id: taskId },
            data: { status: TaskStatus.FAILED, error },
        });
    }

    protected async callAI(prompt: string, maxTokens = 1500): Promise<string> {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: maxTokens,
        });
        return response.choices[0].message.content ?? "";
    }
}