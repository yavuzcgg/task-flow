"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin-guard";
import { Navbar } from "@/components/layout/navbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FolderKanban, ListTodo, ArrowLeft } from "lucide-react";

const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Kullanıcılar", icon: Users },
  { path: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { path: "/admin/tasks", label: "Görevler", icon: ListTodo },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const lang = pathname.split("/")[1] || "tr";

  return (
    <AdminGuard>
      <div className="min-h-screen">
        {/* Admin Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {adminNavItems.map((item) => {
                const href = `/${lang}${item.path}`;
                const isActive =
                  item.path === "/admin"
                    ? pathname === href
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={item.path}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-3 border-t" />
              <Link
                href={`/${lang}/dashboard`}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfaya Dön
              </Link>
            </nav>
          </div>
        </aside>

        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:pl-64">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
