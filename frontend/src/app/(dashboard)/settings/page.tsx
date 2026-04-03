"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Açık", icon: Sun },
  { value: "dark", label: "Koyu", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
];

const colorThemes = [
  { name: "Slate", value: "slate", color: "bg-slate-500" },
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Purple", value: "purple", color: "bg-purple-500" },
  { name: "Rose", value: "rose", color: "bg-rose-500" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setColorTheme] = useState("slate");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("color-theme");
    if (saved) setColorTheme(saved);
  }, []);

  const handleColorChange = (value: string) => {
    setColorTheme(value);
    localStorage.setItem("color-theme", value);
    document.documentElement.setAttribute("data-theme", value);
  };

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Ayarlar</h1>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Ad Soyad</Label>
            <span className="text-sm font-medium">{user?.fullName}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">E-posta</Label>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Rol</Label>
            <span className="text-sm font-medium">{user?.role}</span>
          </div>
        </CardContent>
      </Card>

      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Tema Modu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={theme === opt.value ? "default" : "outline"}
                className="flex flex-col gap-1 h-auto py-3"
                onClick={() => setTheme(opt.value)}
              >
                <opt.icon className="h-5 w-5" />
                <span className="text-xs">{opt.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Renk Teması</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {colorThemes.map((ct) => (
              <button
                key={ct.value}
                onClick={() => handleColorChange(ct.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors hover:bg-muted",
                  colorTheme === ct.value && "border-primary bg-muted"
                )}
              >
                <div className={cn("relative h-8 w-8 rounded-full", ct.color)}>
                  {colorTheme === ct.value && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                  )}
                </div>
                <span className="text-xs">{ct.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Renk teması özelleştirmesi ileride CSS variables ile tam entegre edilecek
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
