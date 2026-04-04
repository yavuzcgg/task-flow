"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban } from "lucide-react";
import { useDictionary } from "@/providers/dictionary-provider";

export default function AdminProjectsPage() {
  const dict = useDictionary();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.admin.projectsPage.title}</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FolderKanban className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">{dict.common.comingSoon}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {dict.admin.projectsPage.comingSoonNote}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
