"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    FolderOpen,
    Plus,
    FileText,
    CheckCircle2,
    Filter,
} from "lucide-react";

import { getProjects } from "@/actions/project";
import { getWorkspaces } from "@/actions/workspace";
import { NewProjectDialog } from "@/components/forms/new-project-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ProjectStatus } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

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

type WorkspaceOption = { id: string; name: string };

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: "ALL", label: "All statuses" },
    { value: "ACTIVE", label: "Active" },
    { value: "PAUSED", label: "Paused" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ARCHIVED", label: "Archived" },
];

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    PAUSED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    COMPLETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    ARCHIVED: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status] ?? STATUS_STYLES.ACTIVE}`}>
            {status}
        </span>
    );
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-20 text-center dark:border-slate-800">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <FolderOpen className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {filtered ? "No projects match your filters" : "No projects yet"}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                {filtered
                    ? "Try changing the workspace or status filter."
                    : "Create your first project to start generating AI content."}
            </p>
            {!filtered && (
                <div className="mt-6">
                    <NewProjectDialog
                        trigger={
                            <Button size="sm" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                Create project
                            </Button>
                        }
                    />
                </div>
            )}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [wsFilter, setWsFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        Promise.all([getProjects(), getWorkspaces()]).then(([projRes, wsRes]) => {
            if (!projRes.success) toast.error(projRes.error);
            else setProjects(projRes.data ?? []);

            if (wsRes.success && wsRes.data)
                setWorkspaces(wsRes.data.map((w) => ({ id: w.id, name: w.name })));

            setLoading(false);
        });
    }, []);

    const filtered = projects.filter((p) => {
        const wsMatch = wsFilter === "ALL" || p.workspaceId === wsFilter;
        const statusMatch = statusFilter === "ALL" || p.status === statusFilter;
        return wsMatch && statusMatch;
    });

    const isFiltered = wsFilter !== "ALL" || statusFilter !== "ALL";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Projects
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {loading
                            ? "Loading…"
                            : `${projects.length} project${projects.length !== 1 ? "s" : ""} across all workspaces`}
                    </p>
                </div>
                <NewProjectDialog
                    trigger={
                        <Button size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            New project
                        </Button>
                    }
                />
            </div>

            {/* Filter bar */}
            {!loading && projects.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Filter className="h-3.5 w-3.5" />
                        Filter by
                    </div>

                    <Select value={wsFilter} onValueChange={setWsFilter}>
                        <SelectTrigger className="h-8 w-44 text-xs">
                            <SelectValue placeholder="Workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All workspaces</SelectItem>
                            {workspaces.map((ws) => (
                                <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 w-36 text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-slate-500"
                            onClick={() => { setWsFilter("ALL"); setStatusFilter("ALL"); }}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState filtered={isFiltered} />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((project) => (
                        <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                            <Card className="h-full transition-shadow duration-150 hover:shadow-md">
                                <CardContent className="flex h-full flex-col p-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {project.workspaceName}
                                        </span>
                                        <StatusBadge status={project.status} />
                                    </div>

                                    <h2 className="mt-2.5 text-base font-semibold text-slate-900 group-hover:text-slate-700 dark:text-white dark:group-hover:text-slate-200">
                                        {project.title}
                                    </h2>

                                    {project.description ? (
                                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                            {project.description}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs italic text-slate-400 dark:text-slate-600">
                                            No description
                                        </p>
                                    )}

                                    <div className="flex-1" />

                                    <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <FileText className="h-3.5 w-3.5" />
                                            {project.contentCount} piece{project.contentCount !== 1 ? "s" : ""}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            {project.taskCount} task{project.taskCount !== 1 ? "s" : ""}
                                        </div>
                                        <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-600">
                                            {formatDate(project.createdAt)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}