"use client";

import { useEffect, useState, useCallback } from "react";
import { membersApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, UserMinus, Shield, Eye, Users } from "lucide-react";
import { toast } from "sonner";
import { ProjectRole } from "@/types";
import type { ProjectMemberResponse } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

interface MemberListProps {
  projectId: string;
  currentUserRole: string | null;
}

const roleLabels: Record<string, string> = {
  Owner: "Sahip",
  Admin: "Yönetici",
  Member: "Üye",
  Viewer: "İzleyici",
};

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  Owner: "default",
  Admin: "default",
  Member: "secondary",
  Viewer: "outline",
};

export function MemberList({ projectId, currentUserRole }: MemberListProps) {
  const [members, setMembers] = useState<ProjectMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const canManage = currentUserRole === "Owner" || currentUserRole === "Admin";

  const fetchMembers = useCallback(async () => {
    try {
      const res = await membersApi.getByProject(projectId);
      setMembers(res.data);
    } catch {
      toast.error("Üyeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRemove = async (userId: string) => {
    if (!window.confirm("Bu üyeyi projeden çıkarmak istediğinize emin misiniz?"))
      return;

    try {
      await membersApi.remove(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      toast.success("Üye projeden çıkarıldı");
    } catch {
      toast.error("Üye çıkarılamadı");
    }
  };

  const handleRoleChange = async (userId: string, newRole: ProjectRole) => {
    try {
      await membersApi.updateRole(projectId, userId, { role: newRole });
      setMembers((prev) =>
        prev.map((m) =>
          m.userId === userId
            ? { ...m, role: ProjectRole[newRole] }
            : m
        )
      );
      toast.success("Rol güncellendi");
    } catch {
      toast.error("Rol güncellenemedi");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {member.userFullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{member.userFullName}</p>
              <p className="text-xs text-muted-foreground">
                {member.userEmail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={roleBadgeVariant[member.role] || "secondary"}>
              {roleLabels[member.role] || member.role}
            </Badge>
            {canManage &&
              member.role !== "Owner" &&
              member.userId !== user?.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    {currentUserRole === "Owner" && (
                      <>
                        {member.role !== "Admin" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(member.userId, ProjectRole.Admin)
                            }
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Yönetici Yap
                          </DropdownMenuItem>
                        )}
                        {member.role !== "Member" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(member.userId, ProjectRole.Member)
                            }
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Üye Yap
                          </DropdownMenuItem>
                        )}
                        {member.role !== "Viewer" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(member.userId, ProjectRole.Viewer)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            İzleyici Yap
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleRemove(member.userId)}
                      className="text-destructive focus:text-destructive"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Çıkar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
