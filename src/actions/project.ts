"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProjectStatus, TaskStatus, ContentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation schemas ────────────────────────────────────────────────────────

const createProjectSchema = z.object({
    workspaceId: z.string().min(1, "Workspace is required"),
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(500).optional(),
});

const updateProjectSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    status: z.nativeEnum(ProjectStatus).optional(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function requireUserId(): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}

async function requireProjectAccess(
    projectId: string,
    userId: string
): Promise<{ workspaceId: string }> {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            workspaceId: true,
            workspace: {
                select: {
                    members: { where: { userId }, select: { id: true } },
                },
            },
        },
    });

    if (!project) throw new Error("Project not found");
    if (project.workspace.members.length === 0)
        throw new Error("You do not have access to this project");

    return { workspaceId: project.workspaceId };
}

// ── Action result type ────────────────────────────────────────────────────────

type ActionResult<T = undefined> =
    | { success: true; data?: T }
    | { success: false; error: string };

// ── createProject ─────────────────────────────────────────────────────────────

export async function createProject(
    workspaceId: string,
    title: string,
    description: string = ""
): Promise<ActionResult<{ id: string }>> {
    try {
        const userId = await requireUserId();

        const parsed = createProjectSchema.safeParse({ workspaceId, title, description });
        if (!parsed.success)
            return { success: false, error: parsed.error.issues[0].message };

        const membership = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!membership)
            return { success: false, error: "You are not a member of this workspace" };

        const project = await prisma.project.create({
            data: {
                workspaceId: parsed.data.workspaceId,
                userId,
                title: parsed.data.title,
                description: parsed.data.description ?? "",
                status: ProjectStatus.ACTIVE,
            },
            select: { id: true },
        });

        revalidatePath("/projects");
        revalidatePath(`/workspace/${workspaceId}`);
        return { success: true, data: { id: project.id } };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create project";
        return { success: false, error: message };
    }
}

// ── getProjects ───────────────────────────────────────────────────────────────

type ProjectSummary = {
    id: string;
    title: string;
    description: string | null;
    status: ProjectStatus;
    createdAt: Date;
    workspaceId: string;
    workspaceName: string;
    contentCount: number;
    taskCount: number;
};

export async function getProjects(
    workspaceId?: string
): Promise<ActionResult<ProjectSummary[]>> {
    try {
        const userId = await requireUserId();

        const projects = await prisma.project.findMany({
            where: {
                workspace: {
                    members: { some: { userId } },
                    ...(workspaceId ? { id: workspaceId } : {}),
                },
            },
            orderBy: { createdAt: "desc" },
            include: {
                workspace: { select: { name: true } },
                _count: { select: { contents: true, tasks: true } },
            },
        });

        const data: ProjectSummary[] = projects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description ?? null,
            status: p.status,
            createdAt: p.createdAt,
            workspaceId: p.workspaceId,
            workspaceName: p.workspace.name,
            contentCount: p._count.contents,
            taskCount: p._count.tasks,
        }));

        return { success: true, data };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch projects";
        return { success: false, error: message };
    }
}

// ── getProjectById ────────────────────────────────────────────────────────────

type ContentItem = {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: Date;
    prompt: string;
};

type TaskItem = {
    id: string;
    type: string;
    status: string;
    agentType: string | null;
    orderIndex: number;
    createdAt: Date;
    error: string | null;
};

type ProjectDetail = {
    id: string;
    title: string;
    description: string | null;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
    workspaceId: string;
    workspaceName: string;
    memberCount: number;
    contents: ContentItem[];
    tasks: TaskItem[];
};

export async function getProjectById(
    id: string
): Promise<ActionResult<ProjectDetail>> {
    try {
        const userId = await requireUserId();
        await requireProjectAccess(id, userId);

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                workspace: {
                    select: { name: true, _count: { select: { members: true } } },
                },
                contents: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        status: true,
                        createdAt: true,
                        prompt: true,
                    },
                },
                tasks: {
                    orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
                    select: {
                        id: true,
                        type: true,
                        status: true,
                        agentType: true,
                        orderIndex: true,
                        createdAt: true,
                        error: true,
                    },
                },
            },
        });

        if (!project) return { success: false, error: "Project not found" };

        return {
            success: true,
            data: {
                id: project.id,
                title: project.title,
                description: project.description ?? null,
                status: project.status,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                workspaceId: project.workspaceId,
                workspaceName: project.workspace.name,
                memberCount: project.workspace._count.members,
                contents: project.contents,
                tasks: project.tasks,
            },
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch project";
        return { success: false, error: message };
    }
}

// ── updateProject ─────────────────────────────────────────────────────────────

export async function updateProject(
    id: string,
    data: { title?: string; description?: string; status?: ProjectStatus }
): Promise<ActionResult> {
    try {
        const userId = await requireUserId();
        const { workspaceId } = await requireProjectAccess(id, userId);

        const parsed = updateProjectSchema.safeParse(data);
        if (!parsed.success)
            return { success: false, error: parsed.error.issues[0].message };

        await prisma.project.update({
            where: { id },
            data: {
                ...(parsed.data.title !== undefined && { title: parsed.data.title }),
                ...(parsed.data.description !== undefined && { description: parsed.data.description }),
                ...(parsed.data.status !== undefined && { status: parsed.data.status }),
            },
        });

        revalidatePath(`/projects/${id}`);
        revalidatePath("/projects");
        revalidatePath(`/workspace/${workspaceId}`);
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update project";
        return { success: false, error: message };
    }
}

// ── deleteProject ─────────────────────────────────────────────────────────────

export async function deleteProject(id: string): Promise<ActionResult> {
    try {
        const userId = await requireUserId();
        const { workspaceId } = await requireProjectAccess(id, userId);

        await prisma.project.delete({ where: { id } });

        revalidatePath("/projects");
        revalidatePath(`/workspace/${workspaceId}`);
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete project";
        return { success: false, error: message };
    }
}

// ── getProjectStats ───────────────────────────────────────────────────────────

type ProjectStats = {
    totalContent: number;
    pendingTasks: number;
    completedTasks: number;
    contentByType: { type: ContentType; count: number }[];
};

export async function getProjectStats(
    id: string
): Promise<ActionResult<ProjectStats>> {
    try {
        const userId = await requireUserId();
        await requireProjectAccess(id, userId);

        const [totalContent, pendingTasks, completedTasks, contentByTypeRaw] =
            await Promise.all([
                prisma.content.count({ where: { projectId: id } }),
                prisma.task.count({ where: { projectId: id, status: TaskStatus.PENDING } }),
                prisma.task.count({ where: { projectId: id, status: TaskStatus.COMPLETED } }),
                prisma.content.groupBy({
                    by: ["type"],
                    where: { projectId: id },
                    _count: { type: true },
                }),
            ]);

        return {
            success: true,
            data: {
                totalContent,
                pendingTasks,
                completedTasks,
                contentByType: contentByTypeRaw.map((r) => ({
                    type: r.type,
                    count: r._count.type,
                })),
            },
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch project stats";
        return { success: false, error: message };
    }
}