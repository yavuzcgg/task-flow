"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { projectsApi } from "@/lib/api";
import { ProjectCard } from "@/components/project-card";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Plus } from "lucide-react";
import { useDictionary } from "@/providers/dictionary-provider";
import type { ProjectResponse } from "@/types";

export default function DashboardPage() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "tr";
  const dict = useDictionary();
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await projectsApi.getAll({ page: 1, pageSize: 5 });
      setProjects(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch {
      // API hatası — boş göster
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {dict.dashboard.welcome.replace("{name}", user?.fullName || dict.dashboard.welcomeFallback)}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {dict.common.newProject}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {dict.dashboard.totalProjects}
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{totalCount}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{dict.dashboard.recentProjects}</h2>
          {projects.length > 0 && (
            <Link
              href={`/${lang}/projects`}
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              {dict.dashboard.allProjects}
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">{dict.dashboard.noProjects}</p>
            <p className="text-sm text-muted-foreground">
              {dict.dashboard.noProjectsHint}
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {dict.common.createProject}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
