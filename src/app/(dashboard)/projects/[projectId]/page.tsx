// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { getProjectById, getProjectStats, updateProject, deleteProject } from "@/actions/project";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { FileText, CheckSquare, Clock, Users, ArrowUpRight, Sparkles, AlertTriangle, Loader2 } from "lucide-react";

// export default function ProjectDetail() {
//     const params = useParams();
//     const router = useRouter();
//     const projectId = params.projectId as string;

//     const [project, setProject] = useState<any>(null);
//     const [stats, setStats] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     // Edit fields forms
//     const [editTitle, setEditTitle] = useState("");
//     const [editDesc, setEditDesc] = useState("");
//     const [editStatus, setEditStatus] = useState<any>("");

//     const loadData = async () => {
//         try {
//             setLoading(true);
//             const pData = await getProjectById(projectId);
//             const sData = await getProjectStats(projectId);
//             setProject(pData);
//             setStats(sData);

//             setEditTitle(pData.title);
//             setEditDesc(pData.description || "");
//             setEditStatus(pData.status);
//         } catch (err) {
//             console.error(err);
//             router.push("/projects");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { if (projectId) loadData(); }, [projectId]);

//     const handleUpdate = async () => {
//         setSaving(true);
//         await updateProject(projectId, { title: editTitle, description: editDesc, status: editStatus });
//         await loadData();
//         setSaving(false);
//     };

//     const handleDelete = async () => {
//         if (confirm("Are you absolutely sure you want to delete this project? This removes all continuous background Agent run data.")) {
//             setSaving(true);
//             await deleteProject(projectId);
//             router.push("/projects");
//         }
//     };

//     if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

//     return (
//         <div className="p-8 space-y-6 max-w-7xl mx-auto">
//             {/* Header Block */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4">
//                 <div>
//                     <div className="flex items-center gap-3">
//                         <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
//                         <Badge className="capitalize">{project.status.toLowerCase()}</Badge>
//                     </div>
//                     <p className="text-sm text-slate-500 mt-1">{project.description || "No project description provided."}</p>
//                 </div>
//             </div>

//             {/* Stats Quickbar Metrics */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 <Card className="flex items-center p-4 gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText className="h-5 w-5" /></div>
//                     <div><p className="text-xs font-medium text-slate-500 uppercase">Total Content</p><h3 className="text-xl font-bold">{stats?.totalContent}</h3></div>
//                 </Card>
//                 <Card className="flex items-center p-4 gap-4">
//                     <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock className="h-5 w-5" /></div>
//                     <div><p className="text-xs font-medium text-slate-500 uppercase">Pending Tasks</p><h3 className="text-xl font-bold">{stats?.pendingTasks}</h3></div>
//                 </Card>
//                 <Card className="flex items-center p-4 gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckSquare className="h-5 w-5" /></div>
//                     <div><p className="text-xs font-medium text-slate-500 uppercase">Completed Tasks</p><h3 className="text-xl font-bold">{stats?.completedTasks}</h3></div>
//                 </Card>
//                 <Card className="flex items-center p-4 gap-4">
//                     <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users className="h-5 w-5" /></div>
//                     <div><p className="text-xs font-medium text-slate-500 uppercase">Team Members</p><h3 className="text-xl font-bold">{stats?.totalMembers}</h3></div>
//                 </Card>
//             </div>

//             {/* Workspace Feature Tabs */}
//             <Tabs defaultValue="content" className="space-y-6">
//                 <TabsList className="bg-slate-100 p-1">
//                     <TabsTrigger value="content">Content</TabsTrigger>
//                     <TabsTrigger value="tasks">Tasks Engine</TabsTrigger>
//                     <TabsTrigger value="settings">Settings</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="content" className="space-y-4">
//                     <div className="flex justify-between items-center">
//                         <h2 className="text-xl font-semibold">Project Content Assets</h2>
//                         <Button size="sm" className="gap-2"><Sparkles className="h-4 w-4" /> Generate New</Button>
//                     </div>
//                     {project.contents.length === 0 ? (
//                         <div className="text-center p-12 border rounded-xl bg-white text-muted-foreground text-sm">No items created inside this environment yet.</div>
//                     ) : (
//                         <div className="bg-white border rounded-xl divide-y">
//                             {project.contents.map((item: any) => (
//                                 <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
//                                     <div>
//                                         <h4 className="font-medium text-slate-900">{item.title}</h4>
//                                         <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                         <Badge variant="outline" className="uppercase text-[10px]">{item.type}</Badge>
//                                         <Badge variant="secondary" className="capitalize">{item.status.toLowerCase()}</Badge>
//                                         <Button size="icon" variant="ghost"><ArrowUpRight className="h-4 w-4" /></Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </TabsContent>

//                 <TabsContent value="tasks" className="space-y-4">
//                     <h2 className="text-xl font-semibold">Agentic Execution Stream</h2>
//                     {project.tasks.length === 0 ? (
//                         <div className="text-center p-12 border rounded-xl bg-white text-muted-foreground text-sm">Autonomous operational logs empty.</div>
//                     ) : (
//                         <div className="bg-white border rounded-xl divide-y">
//                             {project.tasks.map((task: any) => (
//                                 <div key={task.id} className="p-4 flex justify-between items-center">
//                                     <div className="flex items-center gap-3">
//                                         <div className={`h-2.5 w-2.5 rounded-full ${task.status === "COMPLETED" ? "bg-emerald-500" : task.status === "RUNNING" ? "bg-blue-500 animate-pulse" : "bg-amber-500"}`} />
//                                         <div>
//                                             <h4 className="font-medium text-slate-800 text-sm">{task.name || "Generation Task"}</h4>
//                                             <p className="text-xs text-slate-400">Order/Priority tier: {task.order || 0}</p>
//                                         </div>
//                                     </div>
//                                     <span className="text-xs text-slate-500">{new Date(task.createdAt).toLocaleDateString()}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </TabsContent>

//                 <TabsContent value="settings" className="space-y-6">
//                     <Card>
//                         <CardHeader><CardTitle>Project Profile Details</CardTitle><CardDescription>Update name identifiers and operating environment status.</CardDescription></CardHeader>
//                         <CardContent className="space-y-4">
//                             <div className="space-y-2">
//                                 <label className="text-xs font-semibold text-slate-600">Project Title</label>
//                                 <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-xs font-semibold text-slate-600">Project Description</label>
//                                 <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-xs font-semibold text-slate-600">Status Environment</label>
//                                 <Select value={editStatus} onValueChange={(val: any) => setEditStatus(val)}>
//                                     <SelectTrigger><SelectValue /></SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="ACTIVE">Active</SelectItem>
//                                         <SelectItem value="PAUSED">Paused</SelectItem>
//                                         <SelectItem value="COMPLETED">Completed</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <Button onClick={handleUpdate} disabled={saving}>{saving ? "Saving Changes..." : "Save Settings"}</Button>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-red-200 bg-red-50/20">
//                         <CardHeader>
//                             <CardTitle className="text-red-700 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Danger Zone</CardTitle>
//                             <CardDescription className="text-red-600/80">Deleting this project completely removes all connected generated content items, dynamic metadata arrays, and asynchronous background action jobs.</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <Button variant="destructive" onClick={handleDelete} disabled={saving}>Delete Project Permanently</Button>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }