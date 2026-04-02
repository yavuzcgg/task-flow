"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { tasksApi } from "@/lib/api";
import { CommentSection } from "@/components/comment-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Flag, Layers } from "lucide-react";
import type { TaskResponse } from "@/types";

const statusLabels: Record<string, string> = {
  Todo: "Yapılacak",
  InProgress: "Devam Ediyor",
  InReview: "İncelemede",
  Done: "Tamamlandı",
};

const statusColors: Record<string, string> = {
  Todo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  InProgress: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300",
  InReview: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-300",
  Done: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300",
};

const priorityLabels: Record<string, string> = {
  Low: "Düşük",
  Medium: "Orta",
  High: "Yüksek",
  Critical: "Kritik",
};

const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const taskId = params.taskId as string;

  const [task, setTask] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      const response = await tasksApi.getById(taskId);
      setTask(response.data);
    } catch {
      toast.error("Görev yüklenemedi");
      router.push(`/projects/${projectId}`);
    } finally {
      setLoading(false);
    }
  }, [taskId, projectId, router]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!task) return null;

  const formattedCreatedAt = new Date(task.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/projects/${projectId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{task.title}</h1>
      </div>

      {/* Task Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Görev Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status & Priority */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className={statusColors[task.status] || ""}>
                {statusLabels[task.status] || task.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className={priorityColors[task.priority] || ""}>
                {priorityLabels[task.priority] || task.priority}
              </Badge>
            </div>
            {formattedDueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formattedDueDate}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">Açıklama</p>
                <p className="text-sm whitespace-pre-wrap">{task.description}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Meta */}
          <p className="text-xs text-muted-foreground">
            Oluşturulma: {formattedCreatedAt}
          </p>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardContent className="pt-6">
          <CommentSection taskId={taskId} />
        </CardContent>
      </Card>
    </div>
  );
}
