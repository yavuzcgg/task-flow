"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { invitationsApi } from "@/lib/api";
import { useDictionary } from "@/providers/dictionary-provider";
import { toast } from "sonner";
import type { InvitationResponse } from "@/types";

export function InvitationDropdown() {
  const dict = useDictionary();
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);

  const roleLabels: Record<string, string> = {
    Viewer: dict.common.roles.Viewer,
    Member: dict.common.roles.Member,
    Admin: dict.common.roles.Admin,
  };
  const [loading, setLoading] = useState(false);

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await invitationsApi.getPending();
      setInvitations(res.data);
    } catch {
      // Sessiz hata
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleRespond = async (id: string, accept: boolean) => {
    setLoading(true);
    try {
      await invitationsApi.respond(id, accept);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      toast.success(accept ? dict.invitations.acceptSuccess : dict.invitations.rejectSuccess);
    } catch {
      toast.error(dict.invitations.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {invitations.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {invitations.length}
              </Badge>
            )}
            <span className="sr-only">{dict.invitations.label}</span>
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-80">
        {invitations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {dict.invitations.noPending}
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col gap-2 border-b p-3 last:border-0"
              >
                <div className="text-sm">
                  {dict.invitations.invitedBy
                    .split("{inviter}")
                    .flatMap((part, i) =>
                      i === 0
                        ? [part]
                        : [
                            <span key={`inviter-${inv.id}`} className="font-medium">{inv.invitedByUserName}</span>,
                            part,
                          ]
                    )
                    .flatMap((part, i) =>
                      typeof part === "string"
                        ? part.split("{project}").flatMap((sub, j) =>
                            j === 0
                              ? [sub]
                              : [
                                  <span key={`project-${inv.id}-${j}`} className="font-medium">{inv.projectName}</span>,
                                  sub,
                                ]
                          )
                        : [part]
                    )}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {roleLabels[inv.role] || inv.role}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-destructive hover:text-destructive"
                      onClick={() => handleRespond(inv.id, false)}
                      disabled={loading}
                    >
                      <X className="mr-1 h-3 w-3" />
                      {dict.invitations.reject}
                    </Button>
                    <Button
                      size="sm"
                      className="h-7"
                      onClick={() => handleRespond(inv.id, true)}
                      disabled={loading}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      {dict.invitations.accept}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
