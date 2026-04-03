"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, hydrate } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const lang = pathname.split("/")[1] || "tr";

  useEffect(() => {
    hydrate();
    setIsReady(true);
  }, [hydrate]);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace(`/${lang}/login`);
    } else if (user?.role !== "Admin") {
      router.replace(`/${lang}/dashboard`);
    }
  }, [isReady, isAuthenticated, user, router, lang]);

  if (!isReady || !isAuthenticated || user?.role !== "Admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
