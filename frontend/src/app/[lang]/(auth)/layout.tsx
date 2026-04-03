"use client";

import { AuthGuard } from "@/components/auth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="w-full max-w-md px-4">{children}</div>
      </div>
    </AuthGuard>
  );
}
