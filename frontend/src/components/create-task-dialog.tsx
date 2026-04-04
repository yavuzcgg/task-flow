"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { tasksApi } from "@/lib/api";
import { useDictionary } from "@/providers/dictionary-provider";
import { TaskPriority, type ErrorResponse } from "@/types";

interface CreateTaskDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTaskDialog({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dict = useDictionary();

  const priorityOptions = [
    { value: TaskPriority.Low, label: dict.common.priorities.Low },
    { value: TaskPriority.Medium, label: dict.common.priorities.Medium },
    { value: TaskPriority.High, label: dict.common.priorities.High },
    { value: TaskPriority.Critical, label: dict.common.priorities.Critical },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await tasksApi.create(projectId, {
        title,
        description: description || undefined,
        priority,
        dueDate: dueDate || undefined,
      });
      toast.success(dict.dialogs.createTask.success);
      setTitle("");
      setDescription("");
      setPriority(TaskPriority.Medium);
      setDueDate("");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message || dict.dialogs.createTask.error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.dialogs.createTask.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="task-title">{dict.dialogs.createTask.titleLabel}</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={dict.dialogs.createTask.titlePlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">{dict.dialogs.createTask.descriptionLabel}</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={dict.dialogs.createTask.descriptionPlaceholder}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-priority">{dict.dialogs.createTask.priorityLabel}</Label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due-date">{dict.dialogs.createTask.dueDateLabel}</Label>
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {dict.common.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? dict.common.creating : dict.common.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
