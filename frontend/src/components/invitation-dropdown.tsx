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
import { toast } from "sonner";
import type { InvitationResponse } from "@/types";

const roleLabels: Record<string, string> = {
  Viewer: "İzleyici",
  Member: "Üye",
  Admin: "Yönetici",
};

export function InvitationDropdown() {
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
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
      toast.success(accept ? "Davet kabul edildi" : "Davet reddedildi");
    } catch {
      toast.error("İşlem başarısız");
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
            <span className="sr-only">Davetler</span>
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-80">
        {invitations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Bekleyen davet yok
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col gap-2 border-b p-3 last:border-0"
              >
                <div className="text-sm">
                  <span className="font-medium">{inv.invitedByUserName}</span>{" "}
                  sizi{" "}
                  <span className="font-medium">{inv.projectName}</span>{" "}
                  projesine davet etti
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
                      Reddet
                    </Button>
                    <Button
                      size="sm"
                      className="h-7"
                      onClick={() => handleRespond(inv.id, true)}
                      disabled={loading}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Kabul Et
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
