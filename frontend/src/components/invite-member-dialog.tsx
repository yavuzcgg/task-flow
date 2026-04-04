"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { membersApi } from "@/lib/api";
import { toast } from "sonner";
import { ProjectRole } from "@/types";
import { AxiosError } from "axios";
import { useDictionary } from "@/providers/dictionary-provider";
import type { ErrorResponse } from "@/types";

interface InviteMemberDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteMemberDialog({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ProjectRole>(ProjectRole.Member);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dict = useDictionary();

  const roleOptions = [
    { value: ProjectRole.Viewer, label: dict.common.roles.Viewer },
    { value: ProjectRole.Member, label: dict.common.roles.Member },
    { value: ProjectRole.Admin, label: dict.common.roles.Admin },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await membersApi.invite(projectId, { email, role });
      toast.success(dict.dialogs.inviteMember.success);
      setEmail("");
      setRole(ProjectRole.Member);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message || dict.dialogs.inviteMember.error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.dialogs.inviteMember.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{dict.dialogs.inviteMember.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={dict.dialogs.inviteMember.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{dict.dialogs.inviteMember.roleLabel}</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(Number(e.target.value) as ProjectRole)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {dict.common.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? dict.dialogs.inviteMember.submitting : dict.dialogs.inviteMember.submit}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
