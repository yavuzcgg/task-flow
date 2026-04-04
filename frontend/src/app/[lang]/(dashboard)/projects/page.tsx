"use client";

import { useEffect, useState, useCallback } from "react";
import { projectsApi } from "@/lib/api";
import { ProjectCard } from "@/components/project-card";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FolderKanban, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useDictionary } from "@/providers/dictionary-provider";
import type { ProjectResponse } from "@/types";

export default function ProjectsPage() {
  const dict = useDictionary();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProjects = useCallback(async (targetPage: number = page) => {
    setLoading(true);
    try {
      const response = await projectsApi.getAll({
        page: targetPage,
        pageSize: 9,
      });
      setProjects(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch {
      toast.error(dict.projects.loadError);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProjects(page);
  }, [page, fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(dict.projects.deleteConfirm)) return;

    try {
      await projectsApi.delete(id);
      toast.success(dict.projects.deleteSuccess);
      fetchProjects(page);
    } catch {
      toast.error(dict.projects.deleteError);
    }
  };

  const handleCreated = () => {
    setPage(1);
    fetchProjects(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{dict.projects.title}</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {dict.common.newProject}
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <FolderKanban className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">{dict.projects.noProjects}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {dict.projects.noProjectsHint}
          </p>
          <Button className="mt-6" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {dict.common.createProject}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={() => handleDelete(project.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {dict.common.previous}
              </Button>
              <span className="text-sm text-muted-foreground">
                {`${dict.common.page} ${page} / ${totalPages}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                {dict.common.next}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <CreateProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleCreated}
      />
    </div>
  );
}
