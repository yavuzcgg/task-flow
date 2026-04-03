"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectsApi, tasksApi } from "@/lib/api";
import { useSignalR } from "@/hooks/use-signalr";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import type { ProjectResponse, TaskResponse } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectsApi.getById(projectId),
        tasksApi.getByProject(projectId, { pageSize: 50 }),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data.items);
    } catch {
      toast.error("Proje yüklenemedi");
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // SignalR real-time updates
  useSignalR({
    projectId,
    onTaskCreated: (data) => {
      const newTask = data as TaskResponse;
      setTasks((prev) => {
        if (prev.some((t) => t.id === newTask.id)) return prev;
        return [...prev, newTask];
      });
      toast.info("Yeni görev eklendi");
    },
    onTaskStatusChanged: (data) => {
      const updated = data as TaskResponse;
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    },
    onTaskDeleted: (data) => {
      const { Id } = data as { Id: string };
      setTasks((prev) => prev.filter((t) => t.id !== Id));
    },
  });

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;

    try {
      await tasksApi.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Görev silindi");
    } catch {
      toast.error("Görev silinemedi");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-72" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Görev
        </Button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onTasksChange={setTasks}
        onAddTask={() => setDialogOpen(true)}
        onDeleteTask={handleDeleteTask}
      />

      <CreateTaskDialog
        projectId={projectId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
