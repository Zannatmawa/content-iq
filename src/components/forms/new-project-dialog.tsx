"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createProject } from "@/actions/project";
import { getWorkspaces } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    description: z.string().max(500, "Max 500 characters").optional(),
    workspaceId: z.string().min(1, "Please select a workspace"),
});

type FormValues = z.infer<typeof schema>;

type WorkspaceOption = { id: string; name: string };

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
    trigger?: React.ReactNode;
    defaultWorkspaceId?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function NewProjectDialog({ trigger, defaultWorkspaceId }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
    const [loadingWs, setLoadingWs] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            workspaceId: defaultWorkspaceId ?? "",
        },
    });

    const selectedWorkspaceId = watch("workspaceId");

    useEffect(() => {
        if (!open) return;
        setLoadingWs(true);
        getWorkspaces().then((result) => {
            if (result.success && result.data) {
                setWorkspaces(result.data.map((w) => ({ id: w.id, name: w.name })));
                if (!defaultWorkspaceId && result.data.length === 1) {
                    setValue("workspaceId", result.data[0].id);
                }
            }
            setLoadingWs(false);
        });
    }, [open, defaultWorkspaceId, setValue]);

    function onSubmit(values: FormValues) {
        startTransition(async () => {
            const result = await createProject(
                values.workspaceId,
                values.title,
                values.description ?? ""
            );

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(`Project "${values.title}" created`);
            reset();
            setOpen(false);
            router.push(`/projects/${result.data!.id}`);
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => { if (!isPending) { setOpen(v); if (!v) reset(); } }}
        >
            <DialogTrigger asChild>
                {trigger ?? <Button size="sm">New project</Button>}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                    <DialogDescription>
                        Projects hold your content pieces and AI tasks.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="proj-title">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="proj-title"
                            placeholder="e.g. Summer Campaign"
                            autoFocus
                            disabled={isPending}
                            aria-invalid={!!errors.title}
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive" role="alert">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="proj-desc">
                            Description{" "}
                            <span className="text-xs text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="proj-desc"
                            placeholder="What is this project about?"
                            disabled={isPending}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive" role="alert">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="proj-workspace">
                            Workspace <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={selectedWorkspaceId}
                            onValueChange={(val) => setValue("workspaceId", val, { shouldValidate: true })}
                            disabled={isPending || loadingWs}
                        >
                            <SelectTrigger id="proj-workspace" aria-invalid={!!errors.workspaceId}>
                                <SelectValue placeholder={loadingWs ? "Loading…" : "Select a workspace"} />
                            </SelectTrigger>
                            <SelectContent>
                                {workspaces.length === 0 && !loadingWs ? (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">
                                        No workspaces found. Create one first.
                                    </div>
                                ) : (
                                    workspaces.map((ws) => (
                                        <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.workspaceId && (
                            <p className="text-xs text-destructive" role="alert">{errors.workspaceId.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || loadingWs}>
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</>
                            ) : "Create project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
