// "use server";

// import { db } from "@/lib/db"; // Adjust this import based on your setup
// import { auth } from "@clerk/nextjs/server"; // Switch to next-auth if using it
// import { revalidatePath } from "next/cache";

// // Helper to verify user membership in a workspace
// async function verifyWorkspaceAccess(workspaceId: string) {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const membership = await db.workspaceMember.findFirst({
//         where: {
//             workspaceId,
//             userId, // Assumes your schema tracks userId in workspace members
//         },
//     });

//     if (!membership) throw new Error("Forbidden: You do not belong to this workspace");
//     return userId;
// }

// export async function createProject(workspaceId: string, title: string, description?: string) {
//     await verifyWorkspaceAccess(workspaceId);

//     const project = await db.project.create({
//         data: {
//             workspaceId,
//             title,
//             description,
//             status: "ACTIVE",
//         },
//     });

//     revalidatePath("/projects");
//     return project;
// }

// export async function getProjects(workspaceId?: string) {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Fetch projects belonging to workspaces where the user is a member
//     return await db.project.findMany({
//         where: {
//             ...(workspaceId ? { workspaceId } : {
//                 workspace: {
//                     members: {
//                         some: { userId }
//                     }
//                 }
//             })
//         },
//         include: {
//             workspace: true,
//             _count: {
//                 select: { contents: true, tasks: true }
//             }
//         },
//         orderBy: { createdAt: "desc" },
//     });
// }

// export async function getProjectById(id: string) {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const project = await db.project.findUnique({
//         where: { id },
//         include: {
//             workspace: {
//                 include: { members: true }
//             },
//             contents: true,
//             tasks: true,
//         },
//     });

//     if (!project) throw new Error("Project not found");

//     // Verify user is in the parent workspace
//     const isMember = project.workspace.members.some(m => m.userId === userId);
//     if (!isMember) throw new Error("Forbidden");

//     return project;
// }

// export async function updateProject(id: string, data: { title?: string; description?: string; status?: "ACTIVE" | "PAUSED" | "COMPLETED" }) {
//     const project = await getProjectById(id); // handles verification internally

//     const updated = await db.project.update({
//         where: { id },
//         data,
//     });

//     revalidatePath(`/projects/${id}`);
//     revalidatePath("/projects");
//     return updated;
// }

// export async function deleteProject(id: string) {
//     await getProjectById(id); // handles verification internally

//     await db.project.delete({
//         where: { id },
//     });

//     revalidatePath("/projects");
// }

// export async function getProjectStats(id: string) {
//     const project = await getProjectById(id);

//     const totalContent = project.contents.length;
//     const pendingTasks = project.tasks.filter(t => t.status === "PENDING" || t.status === "RUNNING").length;
//     const completedTasks = project.tasks.filter(t => t.status === "COMPLETED").length;

//     // Breakdown mapping by content type
//     const typeBreakdown: Record<string, number> = {};
//     project.contents.forEach(c => {
//         typeBreakdown[c.type] = (typeBreakdown[c.type] || 0) + 1;
//     });

//     const contentByType = Object.entries(typeBreakdown).map(([name, value]) => ({
//         name,
//         value,
//     }));

//     return {
//         totalContent,
//         pendingTasks,
//         completedTasks,
//         totalMembers: project.workspace.members.length,
//         contentByType,
//     };
// }