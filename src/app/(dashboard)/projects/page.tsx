"use client";

import { useState, useEffect } from "react";
import { getProjects } from "@/actions/project";
import { NewProjectDialog } from "@/components/forms/new-project-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderPlus, Layers, FileText, CheckSquare, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);

            // Extract unique workspaces for the filter
            const uniqueWorkspaces = Array.from(new Map(data.map(p => [p.workspace.id, p.workspace])).values());
            setWorkspaces(uniqueWorkspaces);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const filteredProjects = projects.filter((project) => {
        const wsMatch = selectedWorkspace === "all" || project.workspaceId === selectedWorkspace;
        const statusMatch = selectedStatus === "all" || project.status === selectedStatus;
        return wsMatch && statusMatch;
    });

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
                    <p className="text-sm text-muted-foreground">Manage workspaces, track background agents, and build copy profiles.</p>
                </div>
                <NewProjectDialog onSuccess={fetchInitialData} workspaces={workspaces} />
            </div>

            {/* Filter Bar */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-xl border">
                <div className="w-[200px]">
                    <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                        <SelectTrigger><SelectValue placeholder="All Workspaces" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Workspaces</SelectItem>
                            {workspaces.map((ws) => <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[180px]">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="PAUSED">Paused</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => <div key={n} className="h-48 bg-slate-100 animate-pulse rounded-xl" />)}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 text-center bg-white">
                    <Layers className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800">No projects found</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1 mb-6">
                        Get started by creating a new content environment workspace.
                    </p>
                    <NewProjectDialog onSuccess={fetchInitialData} workspaces={workspaces} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id} className="transition-transform hover:-translate-y-1 block">
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <Badge variant={project.status === "ACTIVE" ? "default" : project.status === "COMPLETED" ? "secondary" : "outline"} className="capitalize">
                                            {project.status.toLowerCase()}
                                        </Badge>
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl mt-2 line-clamp-1 text-slate-800">{project.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[40px] text-xs">{project.description || "No description provided."}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 flex justify-between items-center text-xs text-slate-500 border-t mt-4 bg-slate-50/50 rounded-b-xl py-3 px-6">
                                    <span className="font-medium text-slate-700 max-w-[120px] truncate">{project.workspace.name}</span>
                                    <div className="flex gap-4 items-center">
                                        <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-blue-500" /> {project._count.contents}</span>
                                        <span className="flex items-center gap-1"><CheckSquare className="h-3.5 w-3.5 text-emerald-500" /> {project._count.tasks}</span>
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