"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { InvitationDropdown } from "@/components/invitation-dropdown";
import { LogOut, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const lang = pathname.split("/")[1] || "tr";

  const handleLogout = () => {
    logout();
    router.push(`/${lang}/login`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-card px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <InvitationDropdown />
        <LanguageSwitcher />
        <ThemeToggle />
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {user?.fullName}
        </span>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Çıkış yap</span>
        </Button>
      </div>
    </header>
  );
}
