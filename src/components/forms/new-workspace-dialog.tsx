"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createWorkspace } from "@/actions/workspace";
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
import { useState } from "react";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be under 50 characters"),
    description: z.string().max(200, "Description must be under 200 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
    /** Custom trigger element — defaults to a plain button if omitted */
    trigger?: React.ReactNode;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function NewWorkspaceDialog({ trigger }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", description: "" },
    });

    function onSubmit(values: FormValues) {
        startTransition(async () => {
            const result = await createWorkspace(
                values.name,
                values.description ?? ""
            );

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(`Workspace "${values.name}" created`);
            reset();
            setOpen(false);
            router.refresh();
        });
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!isPending) setOpen(v); }}>
            <DialogTrigger asChild>
                {trigger ?? <Button size="sm">New workspace</Button>}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create workspace</DialogTitle>
                    <DialogDescription>
                        Workspaces group your projects and team members together.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="new-ws-name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="new-ws-name"
                            placeholder="e.g. Marketing Team"
                            disabled={isPending}
                            autoFocus
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive" role="alert">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="new-ws-desc">
                            Description{" "}
                            <span className="text-xs text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="new-ws-desc"
                            placeholder="What is this workspace for?"
                            disabled={isPending}
                            aria-invalid={!!errors.description}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive" role="alert">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                "Create workspace"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
