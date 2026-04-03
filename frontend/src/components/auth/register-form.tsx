"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { translateError, translateErrors } from "@/lib/i18n/error-mapper";
import type { ErrorResponse } from "@/types";

interface RegisterFormProps {
  dict: {
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    submit: string;
    submitting: string;
    hasAccount: string;
    login: string;
    passwordMismatch: string;
    defaultError: string;
  };
  errorMap: Record<string, string>;
  lang: string;
}

export function RegisterForm({ dict, errorMap, lang }: RegisterFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(dict.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({ fullName, email, password });
      setAuth(response.data);
      router.push(`/${lang}/dashboard`);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.errors) {
        const messages = Object.values(axiosError.response.data.errors).flat();
        const translated = translateErrors(messages, errorMap);
        setError(translated.join(" "));
      } else {
        const rawMessage =
          axiosError.response?.data?.message || dict.defaultError;
        setError(translateError(rawMessage, errorMap));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{dict.title}</CardTitle>
        <CardDescription>{dict.subtitle}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">{dict.fullName}</Label>
            <Input
              id="fullName"
              type="text"
              placeholder={dict.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{dict.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder={dict.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dict.password}</Label>
            <Input
              id="password"
              type="password"
              placeholder={dict.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{dict.confirmPassword}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={dict.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? dict.submitting : dict.submit}
          </Button>
          <p className="text-sm text-muted-foreground">
            {dict.hasAccount}{" "}
            <Link
              href={`/${lang}/login`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {dict.login}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
