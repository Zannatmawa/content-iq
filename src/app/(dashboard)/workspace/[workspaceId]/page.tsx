"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    Building2,
    Users,
    FolderOpen,
    Plus,
    Trash2,
    Pencil,
    Crown,
    Eye,
    ShieldCheck,
    Loader2,
    ArrowLeft,
    MoreHorizontal,
    UserPlus,
    X,
} from "lucide-react";
import { Role } from "@prisma/client";

import {
    getWorkspaceById,
    inviteMember,
    removeMember,
    updateMemberRole,
    updateWorkspace,
    deleteWorkspace,
} from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// ── Types ─────────────────────────────────────────────────────────────────────

type Member = {
    id: string;
    role: Role;
    createdAt: Date;
    user: { id: string; name: string | null; email: string; image: string | null };
};

type Project = {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    _count: { contents: number; tasks: number };
};

type WorkspaceData = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    createdAt: Date;
    currentUserRole: Role;
    members: Member[];
    projects: Project[];
};

// ── Constants ─────────────────────────────────────────────────────────────────

const ROLE_OPTIONS: { value: Role; label: string }[] = [
    { value: Role.OWNER, label: "Owner" },
    { value: Role.EDITOR, label: "Editor" },
    { value: Role.REVIEWER, label: "Reviewer" },
    { value: Role.WRITER, label: "Writer" },
];

const ROLE_CONFIG: Record<Role, { icon: React.ElementType; className: string }> = {
    OWNER: { icon: Crown, className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800" },
    EDITOR: { icon: Pencil, className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800" },
    REVIEWER: { icon: Eye, className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800" },
    WRITER: { icon: ShieldCheck, className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800" },
};

const PROJECT_STATUS_STYLE: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    PAUSED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    COMPLETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    ARCHIVED: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700",
};

// ── Small helpers ─────────────────────────────────────────────────────────────

function getInitials(name: string | null, email: string): string {
    if (name) {
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
}

function RoleBadge({ role }: { role: Role }) {
    const { icon: Icon, className } = ROLE_CONFIG[role];
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}>
            <Icon className="h-2.5 w-2.5" />
            {role.charAt(0) + role.slice(1).toLowerCase()}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PROJECT_STATUS_STYLE[status] ?? PROJECT_STATUS_STYLE.ACTIVE}`}>
            {status}
        </span>
    );
}

// ── Invite form schema ────────────────────────────────────────────────────────

const inviteSchema = z.object({
    email: z.string().email("Enter a valid email"),
    role: z.nativeEnum(Role),
});
type InviteValues = z.infer<typeof inviteSchema>;

// ── Edit workspace dialog ─────────────────────────────────────────────────────

function EditWorkspaceDialog({
    workspace,
    onSaved,
}: {
    workspace: WorkspaceData;
    onSaved: (name: string, description: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: workspace.name,
            description: workspace.description ?? "",
        },
    });

    function onSubmit(values: { name: string; description: string }) {
        startTransition(async () => {
            const result = await updateWorkspace(workspace.id, values);
            if (!result.success) { toast.error(result.error); return; }
            toast.success("Workspace updated");
            onSaved(values.name, values.description);
            setOpen(false);
        });
    }

    return (
        <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit workspace</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ws-name">Name</Label>
                            <Input id="ws-name" {...register("name", { required: true })} disabled={isPending} />
                            {errors.name && <p className="text-xs text-destructive">Name is required</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ws-desc">Description</Label>
                            <Input id="ws-desc" placeholder="Optional" {...register("description")} disabled={isPending} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WorkspaceDetailPage() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const router = useRouter();

    const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [invitePending, startInvite] = useTransition();
    const [removingId, setRemovingId] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        getWorkspaceById(workspaceId).then((result) => {
            if (!result.success) { toast.error(result.error); router.push("/workspace"); return; }
            setWorkspace(result.data ?? null);
            setLoading(false);
        });
    }, [workspaceId, router]);

    // ── Invite form ───────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors: inviteErrors },
    } = useForm<InviteValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: { email: "", role: Role.WRITER },
    });

    const selectedRole = watch("role");

    function onInvite(values: InviteValues) {
        startInvite(async () => {
            const result = await inviteMember(workspaceId, values.email, values.role);
            if (!result.success) { toast.error(result.error); return; }
            toast.success("Member invited successfully");
            reset();
            // Refresh workspace data
            const refreshed = await getWorkspaceById(workspaceId);
            if (refreshed.success) setWorkspace(refreshed.data ?? null);
        });
    }

    async function handleRemoveMember(targetUserId: string) {
        setRemovingId(targetUserId);
        const result = await removeMember(workspaceId, targetUserId);
        if (!result.success) { toast.error(result.error); setRemovingId(null); return; }
        toast.success("Member removed");
        setWorkspace((prev) =>
            prev ? { ...prev, members: prev.members.filter((m) => m.user.id !== targetUserId) } : prev
        );
        setRemovingId(null);
    }

    async function handleRoleChange(targetUserId: string, role: Role) {
        const result = await updateMemberRole(workspaceId, targetUserId, role);
        if (!result.success) { toast.error(result.error); return; }
        toast.success("Role updated");
        setWorkspace((prev) =>
            prev
                ? { ...prev, members: prev.members.map((m) => m.user.id === targetUserId ? { ...m, role } : m) }
                : prev
        );
    }

    async function handleDeleteWorkspace() {
        if (!confirm("Delete this workspace and all its projects? This cannot be undone.")) return;
        const result = await deleteWorkspace(workspaceId);
        if (!result.success) { toast.error(result.error); return; }
        toast.success("Workspace deleted");
        router.push("/workspace");
    }

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
            </div>
        );
    }

    if (!workspace) return null;

    const isOwner = workspace.currentUserRole === Role.OWNER;

    return (
        <div className="space-y-6">
            {/* ── Back link ────────────────────────────────────────────────────── */}
            <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                All workspaces
            </Link>

            {/* ── Workspace header ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                        <Building2 className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {workspace.name}
                        </h1>
                        {workspace.description && (
                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                {workspace.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {isOwner && (
                        <EditWorkspaceDialog
                            workspace={workspace}
                            onSaved={(name, description) =>
                                setWorkspace((prev) => prev ? { ...prev, name, description } : prev)
                            }
                        />
                    )}
                    {isOwner && (
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
                                    onSelect={handleDeleteWorkspace}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete workspace
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* ── Members card ─────────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <Users className="h-4 w-4" />
                            Members · {workspace.members.length}
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Members table */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {workspace.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-3 px-5 py-3.5"
                            >
                                {/* Avatar */}
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarImage src={member.user.image ?? undefined} alt={member.user.name ?? ""} />
                                    <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                                        {getInitials(member.user.name, member.user.email)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Name + email */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {member.user.name ?? member.user.email}
                                    </p>
                                    {member.user.name && (
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {member.user.email}
                                        </p>
                                    )}
                                </div>

                                {/* Role — dropdown for owner, badge for others */}
                                {isOwner ? (
                                    <Select
                                        value={member.role}
                                        onValueChange={(val) => handleRoleChange(member.user.id, val as Role)}
                                    >
                                        <SelectTrigger className="h-7 w-28 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLE_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <RoleBadge role={member.role} />
                                )}

                                {/* Remove button (owner only, not self if last owner) */}
                                {isOwner && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-600 dark:text-slate-600 dark:hover:text-red-400"
                                        onClick={() => handleRemoveMember(member.user.id)}
                                        disabled={removingId === member.user.id}
                                        aria-label={`Remove ${member.user.name ?? member.user.email}`}
                                    >
                                        {removingId === member.user.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <X className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Invite form (owners only) */}
                    {isOwner && (
                        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <UserPlus className="h-3.5 w-3.5" />
                                Invite member
                            </p>
                            <form
                                onSubmit={handleSubmit(onInvite)}
                                className="flex flex-col gap-2 sm:flex-row sm:items-start"
                            >
                                {/* Email */}
                                <div className="flex-1 space-y-1">
                                    <Input
                                        type="email"
                                        placeholder="colleague@example.com"
                                        disabled={invitePending}
                                        aria-invalid={!!inviteErrors.email}
                                        {...register("email")}
                                    />
                                    {inviteErrors.email && (
                                        <p className="text-xs text-destructive">{inviteErrors.email.message}</p>
                                    )}
                                </div>

                                {/* Role select */}
                                <Select
                                    value={selectedRole}
                                    onValueChange={(val) => setValue("role", val as Role)}
                                    disabled={invitePending}
                                >
                                    <SelectTrigger className="h-9 w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Submit */}
                                <Button type="submit" size="sm" disabled={invitePending} className="h-9 shrink-0 gap-1.5">
                                    {invitePending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="h-3.5 w-3.5" />
                                            Invite
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Projects card ─────────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <FolderOpen className="h-4 w-4" />
                            Projects · {workspace.projects.length}
                        </CardTitle>
                        <Button asChild size="sm" variant="outline" className="gap-1.5">
                            <Link href={`/projects/new?workspaceId=${workspace.id}`}>
                                <Plus className="h-3.5 w-3.5" />
                                New project
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {workspace.projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <FolderOpen className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No projects yet
                            </p>
                            <Button asChild size="sm" variant="outline" className="mt-3 gap-1.5">
                                <Link href={`/projects/new?workspaceId=${workspace.id}`}>
                                    <Plus className="h-3.5 w-3.5" />
                                    Create first project
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {workspace.projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                            {project.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            {project._count.contents} piece{project._count.contents !== 1 ? "s" : ""}
                                            {" · "}
                                            {project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <StatusBadge status={project.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
