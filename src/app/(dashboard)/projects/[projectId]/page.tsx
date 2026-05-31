"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    Clock,
    Users,
    Plus,
    Sparkles,
    Trash2,
    Loader2,
    AlertTriangle,
    MoreHorizontal,
} from "lucide-react";

import {
    getProjectById,
    getProjectStats,
    updateProject,
    deleteProject,
} from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectStatus } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContentItem = {
    id: string; title: string; type: string;
    status: string; createdAt: Date; prompt: string;
};

type TaskItem = {
    id: string; type: string; status: string;
    agentType: string | null; orderIndex: number;
    createdAt: Date; error: string | null;
};

type ProjectDetail = {
    id: string; title: string; description: string | null;
    status: ProjectStatus; createdAt: Date; updatedAt: Date;
    workspaceId: string; workspaceName: string;
    memberCount: number; contents: ContentItem[]; tasks: TaskItem[];
};

type ProjectStats = {
    totalContent: number; pendingTasks: number;
    completedTasks: number;
    contentByType: { type: string; count: number }[];
};

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTENT_STATUS_STYLES: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    GENERATING: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
    REVIEWING: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    PUBLISHED: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
};

const TASK_STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
};

const PROJECT_STATUS_OPTIONS = [
    { value: ProjectStatus.ACTIVE, label: "Active" },
    { value: ProjectStatus.PAUSED, label: "Paused" },
    { value: ProjectStatus.COMPLETED, label: "Completed" },
    { value: ProjectStatus.ARCHIVED, label: "Archived" },
];

const CONTENT_TYPE_LABELS: Record<string, string> = {
    BLOG: "Blog",
    EMAIL: "Email",
    SOCIAL_POST: "Social",
    LANDING_PAGE: "Landing Page",
    AD_COPY: "Ad Copy",
};

// ── Small helpers ─────────────────────────────────────────────────────────────

function SmallBadge({ label, styleClass }: { label: string; styleClass: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styleClass}`}>
            {label.replace(/_/g, " ")}
        </span>
    );
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
    label, value, icon: Icon,
}: { label: string; value: number; icon: React.ElementType }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <Icon className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                </div>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const router = useRouter();

    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [stats, setStats] = useState<ProjectStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [savePending, startSave] = useTransition();
    const [delPending, startDel] = useTransition();

    // Settings form
    const { register, handleSubmit, reset, setValue, watch } = useForm<{
        title: string; description: string; status: ProjectStatus;
    }>();
    const currentStatus = watch("status");

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        Promise.all([getProjectById(projectId), getProjectStats(projectId)]).then(
            ([projRes, statsRes]) => {
                if (!projRes.success) { toast.error(projRes.error); router.push("/projects"); return; }
                setProject(projRes.data ?? null);
                if (projRes.data) {
                    reset({
                        title: projRes.data.title,
                        description: projRes.data.description ?? "",
                        status: projRes.data.status,
                    });
                }
                if (statsRes.success) setStats(statsRes.data ?? null);
                setLoading(false);
            }
        );
    }, [projectId, router, reset]);

    // ── Save settings ─────────────────────────────────────────────────────────
    function onSaveSettings(values: { title: string; description: string; status: ProjectStatus }) {
        startSave(async () => {
            const result = await updateProject(projectId, values);
            if (!result.success) { toast.error(result.error); return; }
            toast.success("Project updated");
            setProject((prev) => prev ? { ...prev, ...values } : prev);
        });
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    function handleDelete() {
        if (!confirm("Delete this project and all its content? This cannot be undone.")) return;
        startDel(async () => {
            const result = await deleteProject(projectId);
            if (!result.success) { toast.error(result.error); return; }
            toast.success("Project deleted");
            router.push("/projects");
        });
    }

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/50" />
                    ))}
                </div>
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="space-y-6">
            {/* Back */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                All projects
            </Link>

            {/* ── Project header ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {project.title}
                        </h1>
                        <SmallBadge
                            label={project.status}
                            styleClass={
                                project.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800" :
                                    project.status === "PAUSED" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800" :
                                        "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                            }
                        />
                    </div>
                    {project.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {project.description}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
                        {project.workspaceName} · Created {formatDate(project.createdAt)}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Button asChild size="sm" className="gap-1.5">
                        <Link href={`/content/new?projectId=${project.id}`}>
                            <Plus className="h-3.5 w-3.5" />
                            New content
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950"
                                onSelect={handleDelete}
                                disabled={delPending}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ── Stats row ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Content" value={stats?.totalContent ?? 0} icon={FileText} />
                <StatCard label="Pending Tasks" value={stats?.pendingTasks ?? 0} icon={Clock} />
                <StatCard label="Completed Tasks" value={stats?.completedTasks ?? 0} icon={CheckCircle2} />
                <StatCard label="Team Members" value={project.memberCount} icon={Users} />
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────────────── */}
            <Tabs defaultValue="content">
                <TabsList className="mb-4">
                    <TabsTrigger value="content">
                        Content
                        {project.contents.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {project.contents.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="tasks">
                        Tasks
                        {project.tasks.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {project.tasks.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* ── Content tab ───────────────────────────────────────────────── */}
                <TabsContent value="content">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Content pieces
                            </CardTitle>
                            <Button asChild size="sm" variant="outline" className="gap-1.5">
                                <Link href={`/content/new?projectId=${project.id}`}>
                                    <Plus className="h-3.5 w-3.5" />
                                    Generate
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {project.contents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <Sparkles className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No content yet
                                    </p>
                                    <Button asChild size="sm" variant="outline" className="mt-3 gap-1.5">
                                        <Link href={`/content/new?projectId=${project.id}`}>
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Generate first piece
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {project.contents.map((content) => (
                                        <div key={content.id} className="flex items-center justify-between px-5 py-3.5">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                                        {content.title}
                                                    </p>
                                                    <SmallBadge
                                                        label={CONTENT_TYPE_LABELS[content.type] ?? content.type}
                                                        styleClass="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                                    />
                                                </div>
                                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                    {formatDate(content.createdAt)}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex items-center gap-2">
                                                <SmallBadge
                                                    label={content.status}
                                                    styleClass={CONTENT_STATUS_STYLES[content.status] ?? CONTENT_STATUS_STYLES.DRAFT}
                                                />
                                                <Button asChild size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs">
                                                    <Link href={`/content/${content.id}`}>
                                                        <Sparkles className="h-3 w-3" />
                                                        Open
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Tasks tab ─────────────────────────────────────────────────── */}
                <TabsContent value="tasks">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Agent tasks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {project.tasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <Clock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No tasks yet — tasks are created when you generate content.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {project.tasks.map((task) => (
                                        <div key={task.id} className="flex items-center gap-4 px-5 py-3.5">
                                            {/* Order index */}
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                {task.orderIndex + 1}
                                            </span>

                                            {/* Type + agent */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                                    {task.type.replace(/_/g, " ")}
                                                </p>
                                                {task.agentType && (
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                        {task.agentType}
                                                    </p>
                                                )}
                                                {task.error && (
                                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        {task.error}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status + date */}
                                            <div className="flex flex-col items-end gap-1">
                                                <SmallBadge
                                                    label={task.status.replace(/_/g, " ")}
                                                    styleClass={TASK_STATUS_STYLES[task.status] ?? TASK_STATUS_STYLES.PENDING}
                                                />
                                                <span className="text-[10px] text-slate-400 dark:text-slate-600">
                                                    {formatDate(task.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Settings tab ──────────────────────────────────────────────── */}
                <TabsContent value="settings">
                    <div className="space-y-6">
                        {/* Edit form */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Project settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSaveSettings)} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="settings-title">Title</Label>
                                        <Input id="settings-title" {...register("title", { required: true })} disabled={savePending} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="settings-desc">Description</Label>
                                        <Input id="settings-desc" placeholder="Optional" {...register("description")} disabled={savePending} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Status</Label>
                                        <Select
                                            value={currentStatus}
                                            onValueChange={(val) => setValue("status", val as ProjectStatus)}
                                            disabled={savePending}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PROJECT_STATUS_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button type="submit" size="sm" disabled={savePending}>
                                        {savePending ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                                        ) : "Save changes"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Danger zone */}
                        <Card className="border-red-200 dark:border-red-900">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                                    Danger zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            Delete this project
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            Permanently deletes the project, all content pieces, and all tasks. This cannot be undone.
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="shrink-0 gap-1.5"
                                        onClick={handleDelete}
                                        disabled={delPending}
                                    >
                                        {delPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <><Trash2 className="h-3.5 w-3.5" />Delete project</>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
