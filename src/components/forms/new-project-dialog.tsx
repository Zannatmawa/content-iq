// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createProject } from "@/actions/project";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { FolderPlus, Loader2 } from "lucide-react";

// interface NewProjectDialogProps {
//     workspaces: any[];
//     onSuccess?: () => void;
// }

// export function NewProjectDialog({ workspaces, onSuccess }: NewProjectDialogProps) {
//     const router = useRouter();
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [selectedWorkspace, setSelectedWorkspace] = useState("");
//     const [error, setError] = useState("");

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!title.trim() || !selectedWorkspace) {
//             setError("Project title and workspace context allocation are required.");
//             return;
//         }

//         try {
//             setLoading(true);
//             setError("");
//             const newProject = await createProject(selectedWorkspace, title, description);

//             setOpen(false);
//             // Reset Form State
//             setTitle("");
//             setDescription("");
//             setSelectedWorkspace("");

//             if (onSuccess) onSuccess();
//             router.push(`/projects/${newProject.id}`);
//         } catch (err: any) {
//             setError(err?.message || "Failed to finalize project instance allocation setup.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button className="gap-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all">
//                     <FolderPlus className="h-4 w-4" /> New Project
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[475px]">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <DialogHeader>
//                         <DialogTitle>Create Content Workspace Project</DialogTitle>
//                         <DialogDescription>
//                             Deploy an isolated management pipeline with specialized AI agents assigned to specific channels.
//                         </DialogDescription>
//                     </DialogHeader>

//                     {error && <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100 font-medium">{error}</div>}

//                     <div className="space-y-4 py-2">
//                         <div className="space-y-1.5">
//                             <label className="text-xs font-semibold text-slate-700">Select Target Workspace *</label>
//                             <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Choose target context workspace" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {workspaces.map((ws) => (
//                                         <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs font-semibold text-slate-700">Project Title *</label>
//                             <Input placeholder="e.g., Q3 Blog Generation Pipeline" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs font-semibold text-slate-700">Description / Directives</label>
//                             <Textarea placeholder="Describe target copy generation directives, target channels, or campaign boundaries..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} rows={3} />
//                         </div>
//                     </div>

//                     <DialogFooter>
//                         <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
//                         <Button type="submit" disabled={loading} className="min-w-[100px]">
//                             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy Project"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }