import { getWorkspaces } from "@/actions/workspace";
import { NewWorkspaceDialog } from "@/components/forms/new-workspace-dialog";
import { auth } from "@/lib/auth/auth-index";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Building2,
    Users,
    FolderOpen,
    Plus,
    ArrowRight,
    Crown,
    Pencil,
    Eye,
    ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Role } from "@prisma/client";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<
    Role,
    { label: string; icon: React.ElementType; className: string }
> = {
    OWNER: {
        label: "Owner",
        icon: Crown,
        className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    },
    EDITOR: {
        label: "Editor",
        icon: Pencil,
        className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
    },
    REVIEWER: {
        label: "Reviewer",
        icon: Eye,
        className:
            "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
    },
    WRITER: {
        label: "Writer",
        icon: ShieldCheck,
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    },
};

function RoleBadge({ role }: { role: Role }) {
    const { label, icon: Icon, className } = ROLE_CONFIG[role];
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
        >
            <Icon className="h-2.5 w-2.5" />
            {label}
        </span>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-20 text-center dark:border-slate-800">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Building2 className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No workspaces yet
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Create your first workspace to start organising projects and inviting
                your team.
            </p>
            <div className="mt-6">
                <NewWorkspaceDialog
                    trigger={
                        <Button size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            Create workspace
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function WorkspacesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const result = await getWorkspaces();
    const workspaces = result.success ? (result.data ?? []) : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Workspaces
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {workspaces.length === 0
                            ? "Manage your teams and projects"
                            : `${workspaces.length} workspace${workspaces.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {workspaces.length > 0 && (
                    <NewWorkspaceDialog
                        trigger={
                            <Button size="sm" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                New workspace
                            </Button>
                        }
                    />
                )}
            </div>

            {/* Content */}
            {workspaces.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {workspaces.map((ws) => (
                        <Link key={ws.id} href={`/workspace/${ws.id}`} className="group block">
                            <Card className="h-full transition-shadow duration-150 hover:shadow-md">
                                <CardContent className="p-5">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                            <Building2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <RoleBadge role={ws.role} />
                                    </div>

                                    {/* Name + description */}
                                    <div className="mt-3">
                                        <h2 className="truncate text-base font-semibold text-slate-900 group-hover:text-slate-700 dark:text-white dark:group-hover:text-slate-200">
                                            {ws.name}
                                        </h2>
                                        {ws.description ? (
                                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                                {ws.description}
                                            </p>
                                        ) : (
                                            <p className="mt-0.5 text-xs italic text-slate-400 dark:text-slate-600">
                                                No description
                                            </p>
                                        )}
                                    </div>

                                    {/* Stats row */}
                                    <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>
                                                {ws.memberCount}{" "}
                                                {ws.memberCount === 1 ? "member" : "members"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <FolderOpen className="h-3.5 w-3.5" />
                                            <span>
                                                {ws.projectCount}{" "}
                                                {ws.projectCount === 1 ? "project" : "projects"}
                                            </span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-700 dark:text-slate-600 dark:group-hover:text-slate-300">
                                            Open
                                            <ArrowRight className="h-3 w-3" />
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
