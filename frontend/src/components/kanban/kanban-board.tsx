"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { tasksApi } from "@/lib/api";
import { toast } from "sonner";
import type { TaskResponse } from "@/types";

const STATUSES = ["Todo", "InProgress", "InReview", "Done"] as const;

const statusToEnum: Record<string, number> = {
  Todo: 0,
  InProgress: 1,
  InReview: 2,
  Done: 3,
};

interface KanbanBoardProps {
  tasks: TaskResponse[];
  onTasksChange: (tasks: TaskResponse[]) => void;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanBoard({
  tasks,
  onTasksChange,
  onAddTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getTasksByStatus = useCallback(
    (status: string) => tasks.filter((t) => t.status === status),
    [tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Determine target status
    let targetStatus: string;
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask) {
      targetStatus = overTask.status;
    } else {
      // Dropped on a column
      targetStatus = over.id as string;
    }

    if (activeTask.status === targetStatus) return;

    // Optimistic update
    const updated = tasks.map((t) =>
      t.id === activeTask.id ? { ...t, status: targetStatus } : t
    );
    onTasksChange(updated);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    // Determine final status
    let targetStatus: string;
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask) {
      targetStatus = overTask.status;
    } else {
      targetStatus = over.id as string;
    }

    // Call API if status changed from original
    const enumValue = statusToEnum[targetStatus];
    if (enumValue === undefined) return;

    try {
      await tasksApi.updateStatus(task.id, { status: enumValue });
    } catch {
      toast.error("Görev durumu güncellenemedi");
      // Revert — parent should refetch
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onAddTask={status === "Todo" ? onAddTask : undefined}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <KanbanCard task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
}
