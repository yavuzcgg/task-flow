"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

interface LandingNavbarProps {
  lang: string;
  dict: {
    login: string;
    register: string;
  };
}

export function LandingNavbar({ lang, dict }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
          Task Flow
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/${lang}/login`} />}>
            {dict.login}
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href={`/${lang}/register`} />}>
            {dict.register}
          </Button>
        </div>
      </div>
    </header>
  );
}
