"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Settings, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useDictionary } from "@/providers/dictionary-provider";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "Admin";
  const lang = pathname.split("/")[1] || "tr";
  const dict = useDictionary();

  const navItems = [
    { path: "/dashboard", label: dict.nav.dashboard, icon: LayoutDashboard },
    { path: "/projects", label: dict.nav.projects, icon: FolderKanban },
    { path: "/settings", label: dict.nav.settings, icon: Settings },
  ];

  const adminItems = [
    { path: "/admin", label: dict.nav.adminPanel, icon: ShieldCheck },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href={`/${lang}/dashboard`} className="text-xl font-bold">
            Task Flow
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const href = `/${lang}${item.path}`;
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
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

          {isAdmin && (
            <>
              <div className="my-3 border-t" />
              {adminItems.map((item) => {
                const href = `/${lang}${item.path}`;
                const isActive =
                  pathname === href || pathname.startsWith(href + "/");
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
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
