"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import type { ProjectResponse } from "@/types";

interface ProjectCardProps {
  project: ProjectResponse;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "tr";

  const formattedDate = new Date(project.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 min-w-0 flex-1">
          <CardTitle className="text-base font-semibold truncate">
            <Link
              href={`/${lang}/projects/${project.id}`}
              className="hover:underline underline-offset-4"
            >
              {project.name}
            </Link>
          </CardTitle>
        </div>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Düzenle
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "Açıklama yok"}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formattedDate}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {project.memberCount}
          </span>
          {project.userRole && (
            <Badge variant="outline">
              {project.userRole === "Owner"
                ? "Sahip"
                : project.userRole === "Admin"
                  ? "Yönetici"
                  : project.userRole === "Member"
                    ? "Üye"
                    : "İzleyici"}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
