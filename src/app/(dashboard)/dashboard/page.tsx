import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatus, TaskStatus } from "@prisma/client";
import {
    FolderOpen,
    FileText,
    Clock,
    Users,
    TrendingUp,
    ArrowUpRight,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentOverTimeChart } from "@/components/charts/content-over-time-chart";

// ── Types ────────────────────────────────────────────────────────────────────

type StatCardProps = {
    title: string;
    value: number;
    icon: React.ElementType;
    description: string;
    href: string;
};

type RecentProject = {
    id: string;
    title: string;
    status: string;
    contentCount: number;
    createdAt: Date;
    workspaceName: string;
};

type RecentContent = {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: Date;
    projectTitle: string;
};

type ChartDay = {
    date: string;
    count: number;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    PAUSED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    COMPLETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    ARCHIVED: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700",
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    GENERATING: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
    REVIEWING: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    PUBLISHED: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
    BLOG: "Blog",
    EMAIL: "Email",
    SOCIAL_POST: "Social",
    LANDING_PAGE: "Landing",
    AD_COPY: "Ad Copy",
};

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchDashboardData(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        totalProjects,
        totalContent,
        pendingTasks,
        workspaceMemberCount,
        recentProjects,
        recentContent,
        contentLast30Days,
    ] = await Promise.all([
        // Stat 1 — total projects
        prisma.project.count({ where: { userId } }),

        // Stat 2 — total content pieces
        prisma.content.count({ where: { userId } }),

        // Stat 3 — pending tasks across user's projects
        prisma.task.count({
            where: {
                status: TaskStatus.PENDING,
                project: { userId },
            },
        }),

        // Stat 4 — total members across all workspaces the user belongs to
        prisma.workspaceMember.count({
            where: {
                workspace: {
                    members: { some: { userId } },
                },
            },
        }),

        // Recent projects (last 5)
        prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                workspace: { select: { name: true } },
                _count: { select: { contents: true } },
            },
        }),

        // Recent content (last 5)
        prisma.content.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                project: { select: { title: true } },
            },
        }),

        // Content created per day for the last 30 days
        prisma.content.findMany({
            where: {
                userId,
                createdAt: { gte: thirtyDaysAgo },
            },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" },
        }),
    ]);

    // ── Build chart data — one entry per day for last 30 days ──────────────────
    const dayMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        dayMap.set(key, 0);
    }
    for (const item of contentLast30Days) {
        const key = item.createdAt.toISOString().slice(0, 10);
        if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    }
    const chartData: ChartDay[] = Array.from(dayMap.entries()).map(
        ([date, count]) => ({
            date: new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            count,
        })
    );

    // ── Normalise recent projects ──────────────────────────────────────────────
    const normalizedProjects: RecentProject[] = recentProjects.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        contentCount: p._count.contents,
        createdAt: p.createdAt,
        workspaceName: p.workspace.name,
    }));

    // ── Normalise recent content ───────────────────────────────────────────────
    const normalizedContent: RecentContent[] = recentContent.map((c) => ({
        id: c.id,
        title: c.title,
        type: c.type,
        status: c.status,
        createdAt: c.createdAt,
        projectTitle: c.project.title,
    }));

    return {
        stats: { totalProjects, totalContent, pendingTasks, workspaceMemberCount },
        chartData,
        recentProjects: normalizedProjects,
        recentContent: normalizedContent,
    };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, description, href }: StatCardProps) {
    return (
        <Link href={href} className="group block">
            <Card className="transition-shadow duration-150 hover:shadow-md">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {title}
                            </p>
                            <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
                                {value.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors duration-150 group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors duration-150 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-300">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>View all</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT}`}
        >
            {status.replace("_", " ")}
        </span>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <TrendingUp className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { stats, chartData, recentProjects, recentContent } =
        await fetchDashboardData(session.user.id);

    const statCards: StatCardProps[] = [
        {
            title: "Total Projects",
            value: stats.totalProjects,
            icon: FolderOpen,
            description: "Across all workspaces",
            href: "/projects",
        },
        {
            title: "Total Content",
            value: stats.totalContent,
            icon: FileText,
            description: "All content pieces",
            href: "/content",
        },
        {
            title: "Pending Tasks",
            value: stats.pendingTasks,
            icon: Clock,
            description: "Waiting to run",
            href: "/projects",
        },
        {
            title: "Workspace Members",
            value: stats.workspaceMemberCount,
            icon: Users,
            description: "Across all workspaces",
            href: "/workspace",
        },
    ];

    return (
        <div className="space-y-8">
            {/* ── Page title ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Welcome back,{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                            {session.user.name ?? session.user.email}
                        </span>
                    </p>
                </div>
                <Button asChild size="sm" className="gap-1.5">
                    <Link href="/content/new">
                        <Plus className="h-4 w-4" />
                        New content
                    </Link>
                </Button>
            </div>

            {/* ── Stat cards ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}
            </div>

            {/* ── Chart ──────────────────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Content created — last 30 days
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs tabular-nums">
                            {stats.totalContent} total
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-4 pt-2">
                    <ContentOverTimeChart data={chartData} />
                </CardContent>
            </Card>

            {/* ── Recent rows ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Projects */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Recent projects
                        </CardTitle>
                        <Link
                            href="/projects"
                            className="text-xs font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white"
                        >
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentProjects.length === 0 ? (
                            <EmptyState message="No projects yet. Create your first one." />
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentProjects.map((project) => (
                                    <li key={project.id}>
                                        <Link
                                            href={`/projects/${project.id}`}
                                            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                                    {project.title}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                                    {project.workspaceName} ·{" "}
                                                    {project.contentCount} piece
                                                    {project.contentCount !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex flex-col items-end gap-1.5">
                                                <StatusBadge status={project.status} />
                                                <span className="text-[10px] text-slate-400 dark:text-slate-600">
                                                    {formatRelativeDate(project.createdAt)}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Content */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Recent content
                        </CardTitle>
                        <Link
                            href="/content"
                            className="text-xs font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white"
                        >
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentContent.length === 0 ? (
                            <EmptyState message="No content yet. Generate your first piece." />
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentContent.map((content) => (
                                    <li key={content.id}>
                                        <Link
                                            href={`/content/${content.id}`}
                                            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                                    {content.title}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                                    {content.projectTitle} ·{" "}
                                                    {CONTENT_TYPE_LABELS[content.type] ?? content.type}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex flex-col items-end gap-1.5">
                                                <StatusBadge status={content.status} />
                                                <span className="text-[10px] text-slate-400 dark:text-slate-600">
                                                    {formatRelativeDate(content.createdAt)}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
