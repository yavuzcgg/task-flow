"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, hydrate } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    hydrate();
    setIsReady(true);
  }, [hydrate]);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== "Admin") {
      router.replace("/dashboard");
    }
  }, [isReady, isAuthenticated, user, router]);

  if (!isReady || !isAuthenticated || user?.role !== "Admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
