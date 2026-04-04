"use client";

import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import { useDictionary } from "@/providers/dictionary-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Users, ListTodo } from "lucide-react";

export default function AdminDashboardPage() {
  const dict = useDictionary();
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const projects = await projectsApi.getAll({ page: 1, pageSize: 1 });
        setProjectCount(projects.data.totalCount);
      } catch {
        // Sessizce devam et
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { label: dict.admin.totalProjects, value: projectCount, icon: FolderKanban },
    { label: dict.admin.usersLabel, value: "—", icon: Users, note: dict.admin.apiPending },
    { label: dict.admin.tasksLabel, value: "—", icon: ListTodo, note: dict.admin.apiPending },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.admin.title}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.note && (
                    <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">{dict.admin.underDevelopment}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {dict.admin.underDevelopmentNote}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
