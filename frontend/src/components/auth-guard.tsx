"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const lang = pathname.split("/")[1] || "tr";

  useEffect(() => {
    hydrate();
    setIsReady(true);
  }, [hydrate]);

  useEffect(() => {
    if (!isReady) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(`/${lang}/login`);
    } else if (!requireAuth && isAuthenticated) {
      router.replace(`/${lang}/dashboard`);
    }
  }, [isReady, isAuthenticated, requireAuth, router, lang]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
