"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban } from "lucide-react";

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tüm Projeler</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FolderKanban className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Yakında</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tüm projeleri listeleme için admin endpoint&apos;i gerekiyor
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
