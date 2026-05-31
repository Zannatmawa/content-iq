import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runBlogWorkflow } from "@/services/workflows/content.workflow";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { contentId } = await req.json();
    if (!contentId) return NextResponse.json({ error: "Missing contentId" }, { status: 400 });

    const content = await prisma.content.findUnique({
        where: { id: contentId },
        include: { project: true },
    });

    if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });

    const metadata = content.metadata as Record<string, unknown> | null;

    runBlogWorkflow(contentId, {
        topic: content.prompt,
        tone: (metadata?.tone as string) || "professional",
        audience: (metadata?.audience as string) || "general",
        projectId: content.projectId,
    }).catch(console.error);

    return NextResponse.json({ success: true, message: "Workflow started" });
}