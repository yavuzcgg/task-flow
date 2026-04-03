"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, MoreVertical, Trash2, Calendar } from "lucide-react";
import type { TaskResponse } from "@/types";

const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

interface KanbanCardProps {
  task: TaskResponse;
  onDelete?: (id: string) => void;
}

export function KanbanCard({ task, onDelete }: KanbanCardProps) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "tr";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-default ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <CardHeader className="flex flex-row items-start gap-2 space-y-0 p-3 pb-1">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Link
          href={`/${lang}/projects/${task.projectId}/tasks/${task.id}`}
          className="flex-1 text-sm font-medium leading-tight hover:underline underline-offset-4"
        >
          {task.title}
        </Link>
        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-muted">
              <MoreVertical className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-1">
        {task.description && (
          <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${priorityColors[task.priority] || ""}`}
          >
            {task.priority}
          </Badge>
          {formattedDueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formattedDueDate}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
