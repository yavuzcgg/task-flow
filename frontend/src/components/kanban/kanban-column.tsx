"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDictionary } from "@/providers/dictionary-provider";
import type { TaskResponse } from "@/types";

const statusColors: Record<string, string> = {
  Todo: "bg-slate-500",
  InProgress: "bg-blue-500",
  InReview: "bg-amber-500",
  Done: "bg-green-500",
};

interface KanbanColumnProps {
  status: string;
  tasks: TaskResponse[];
  onAddTask?: () => void;
  onDeleteTask?: (id: string) => void;
}

export function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const dict = useDictionary();
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const statusLabels: Record<string, string> = {
    Todo: dict.common.statuses.Todo,
    InProgress: dict.common.statuses.InProgress,
    InReview: dict.common.statuses.InReview,
    Done: dict.common.statuses.Done,
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-w-[280px] flex-col rounded-lg border bg-muted/30 ${
        isOver ? "ring-2 ring-primary/50" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status] || "bg-gray-500"}`} />
          <span className="text-sm font-semibold">
            {statusLabels[status] || status}
          </span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        {onAddTask && status === "Todo" && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cards */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted-foreground">
              {dict.kanban.noTasks}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
