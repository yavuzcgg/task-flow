"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = pathname.split("/")[1] || "tr";

  const switchLanguage = (newLang: string) => {
    if (newLang === currentLang) return;

    // Replace the locale segment in the path
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/");

    // Set cookie so proxy remembers preference
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;

    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Globe className="h-4 w-4" />
            <span className="sr-only">Change language</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={currentLang === lang.code ? "font-semibold" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
