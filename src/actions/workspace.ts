"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth-index";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation schemas ────────────────────────────────────────────────────────

const createWorkspaceSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    description: z.string().max(200).optional(),
});

const updateWorkspaceSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(200).optional(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Converts a workspace name into a unique URL slug.
 *  e.g. "My Startup Team" → "my-startup-team-k3x9" */
async function generateSlug(name: string): Promise<string> {
    const base = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 40);

    // Append a short random suffix to guarantee uniqueness without a loop query
    const suffix = Math.random().toString(36).slice(2, 6);
    return `${base}-${suffix}`;
}

/** Returns the current session user id or throws if unauthenticated. */
async function requireUserId(): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}

/** Verifies the current user is an OWNER of the workspace. */
async function requireOwner(workspaceId: string, userId: string): Promise<void> {
    const membership = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
        select: { role: true },
    });
    if (!membership) throw new Error("You are not a member of this workspace");
    if (membership.role !== Role.OWNER)
        throw new Error("Only workspace owners can perform this action");
}

// ── Action result type ────────────────────────────────────────────────────────

type ActionResult<T = undefined> =
    | { success: true; data?: T }
    | { success: false; error: string };

// ── createWorkspace ───────────────────────────────────────────────────────────

export async function createWorkspace(
    name: string,
    description: string = ""
): Promise<ActionResult<{ id: string; slug: string }>> {
    try {
        const userId = await requireUserId();

        const parsed = createWorkspaceSchema.safeParse({ name, description });
        if (!parsed.success)
            return { success: false, error: parsed.error.issues[0].message };

        const slug = await generateSlug(name);

        const workspace = await prisma.workspace.create({
            data: {
                name: parsed.data.name,
                description: parsed.data.description ?? "",
                slug,
                members: {
                    create: {
                        userId,
                        role: Role.OWNER,
                    },
                },
            },
            select: { id: true, slug: true },
        });

        revalidatePath("/workspace");
        return { success: true, data: workspace };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create workspace";
        return { success: false, error: message };
    }
}

// ── getWorkspaces ─────────────────────────────────────────────────────────────

type WorkspaceSummary = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    createdAt: Date;
    memberCount: number;
    projectCount: number;
    role: Role;
};

export async function getWorkspaces(): Promise<ActionResult<WorkspaceSummary[]>> {
    try {
        const userId = await requireUserId();

        const memberships = await prisma.workspaceMember.findMany({
            where: { userId },
            include: {
                workspace: {
                    include: {
                        _count: {
                            select: { members: true, projects: true },
                        },
                    },
                },
            },
            orderBy: { workspace: { createdAt: "desc" } },
        });

        const workspaces: WorkspaceSummary[] = memberships.map((m) => ({
            id: m.workspace.id,
            name: m.workspace.name,
            description: m.workspace.description ?? null,
            slug: m.workspace.slug,
            createdAt: m.workspace.createdAt,
            memberCount: m.workspace._count.members,
            projectCount: m.workspace._count.projects,
            role: m.role,
        }));

        return { success: true, data: workspaces };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch workspaces";
        return { success: false, error: message };
    }
}

// ── getWorkspaceById ──────────────────────────────────────────────────────────

type WorkspaceMemberDetail = {
    id: string;
    role: Role;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
};

type WorkspaceDetail = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    createdAt: Date;
    currentUserRole: Role;
    members: WorkspaceMemberDetail[];
    projects: {
        id: string;
        title: string;
        status: string;
        createdAt: Date;
        _count: { contents: number; tasks: number };
    }[];
};

export async function getWorkspaceById(
    id: string
): Promise<ActionResult<WorkspaceDetail>> {
    try {
        const userId = await requireUserId();

        const workspace = await prisma.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, image: true },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
                projects: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        _count: { select: { contents: true, tasks: true } },
                    },
                },
            },
        });

        if (!workspace) return { success: false, error: "Workspace not found" };

        // Verify the requesting user is a member
        const currentMember = workspace.members.find((m) => m.userId === userId);
        if (!currentMember)
            return { success: false, error: "You are not a member of this workspace" };

        const data: WorkspaceDetail = {
            id: workspace.id,
            name: workspace.name,
            description: workspace.description ?? null,
            slug: workspace.slug,
            createdAt: workspace.createdAt,
            currentUserRole: currentMember.role,
            members: workspace.members.map((m) => ({
                id: m.id,
                role: m.role,
                createdAt: m.createdAt,
                user: m.user,
            })),
            projects: workspace.projects.map((p) => ({
                id: p.id,
                title: p.title,
                status: p.status,
                createdAt: p.createdAt,
                _count: p._count,
            })),
        };

        return { success: true, data };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch workspace";
        return { success: false, error: message };
    }
}

// ── updateWorkspace ───────────────────────────────────────────────────────────

export async function updateWorkspace(
    id: string,
    data: { name?: string; description?: string }
): Promise<ActionResult> {
    try {
        const userId = await requireUserId();
        await requireOwner(id, userId);

        const parsed = updateWorkspaceSchema.safeParse(data);
        if (!parsed.success)
            return { success: false, error: parsed.error.issues[0].message };

        await prisma.workspace.update({
            where: { id },
            data: {
                ...(parsed.data.name && { name: parsed.data.name }),
                ...(parsed.data.description !== undefined && {
                    description: parsed.data.description,
                }),
            },
        });

        revalidatePath(`/workspace/${id}`);
        revalidatePath("/workspace");
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update workspace";
        return { success: false, error: message };
    }
}

// ── deleteWorkspace ───────────────────────────────────────────────────────────

export async function deleteWorkspace(id: string): Promise<ActionResult> {
    try {
        const userId = await requireUserId();
        await requireOwner(id, userId);

        await prisma.workspace.delete({ where: { id } });

        revalidatePath("/workspace");
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete workspace";
        return { success: false, error: message };
    }
}

// ── inviteMember ──────────────────────────────────────────────────────────────

export async function inviteMember(
    workspaceId: string,
    email: string,
    role: Role = Role.WRITER
): Promise<ActionResult<{ memberId: string }>> {
    try {
        const userId = await requireUserId();
        await requireOwner(workspaceId, userId);

        // Validate email
        const emailParsed = z.string().email().safeParse(email);
        if (!emailParsed.success)
            return { success: false, error: "Invalid email address" };

        // Find user by email
        const targetUser = await prisma.user.findUnique({
            where: { email: emailParsed.data },
            select: { id: true },
        });
        if (!targetUser)
            return {
                success: false,
                error: "No account found with that email address",
            };

        // Check not already a member
        const existing = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId: targetUser.id },
            },
        });
        if (existing)
            return { success: false, error: "This user is already a member" };

        const member = await prisma.workspaceMember.create({
            data: { workspaceId, userId: targetUser.id, role },
            select: { id: true },
        });

        revalidatePath(`/workspace/${workspaceId}`);
        return { success: true, data: { memberId: member.id } };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to invite member";
        return { success: false, error: message };
    }
}

// ── removeMember ──────────────────────────────────────────────────────────────

export async function removeMember(
    workspaceId: string,
    targetUserId: string
): Promise<ActionResult> {
    try {
        const userId = await requireUserId();
        await requireOwner(workspaceId, userId);

        // Cannot remove yourself if you are the last owner
        if (targetUserId === userId) {
            const ownerCount = await prisma.workspaceMember.count({
                where: { workspaceId, role: Role.OWNER },
            });
            if (ownerCount <= 1)
                return {
                    success: false,
                    error:
                        "You are the last owner. Transfer ownership before leaving or delete the workspace.",
                };
        }

        await prisma.workspaceMember.delete({
            where: {
                workspaceId_userId: { workspaceId, userId: targetUserId },
            },
        });

        revalidatePath(`/workspace/${workspaceId}`);
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove member";
        return { success: false, error: message };
    }
}

// ── updateMemberRole ──────────────────────────────────────────────────────────

export async function updateMemberRole(
    workspaceId: string,
    targetUserId: string,
    role: Role
): Promise<ActionResult> {
    try {
        const userId = await requireUserId();
        await requireOwner(workspaceId, userId);

        // Prevent removing last owner via role downgrade
        if (targetUserId === userId && role !== Role.OWNER) {
            const ownerCount = await prisma.workspaceMember.count({
                where: { workspaceId, role: Role.OWNER },
            });
            if (ownerCount <= 1)
                return {
                    success: false,
                    error: "Cannot downgrade the last owner. Assign another owner first.",
                };
        }

        await prisma.workspaceMember.update({
            where: {
                workspaceId_userId: { workspaceId, userId: targetUserId },
            },
            data: { role },
        });

        revalidatePath(`/workspace/${workspaceId}`);
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update role";
        return { success: false, error: message };
    }
}