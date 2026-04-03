"use client";

import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Users, ListTodo } from "lucide-react";

export default function AdminDashboardPage() {
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
    { label: "Toplam Proje", value: projectCount, icon: FolderKanban },
    { label: "Kullanıcılar", value: "—", icon: Users, note: "API bekleniyor" },
    { label: "Görevler", value: "—", icon: ListTodo, note: "API bekleniyor" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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
          <p className="text-lg font-medium">Admin panel geliştirme aşamasında</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Backend&apos;e admin endpoint&apos;leri eklendikçe bu panel zenginleşecek
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
