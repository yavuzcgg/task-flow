import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  params,
}: PageProps<"/[lang]/login">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <LoginForm dict={dict.login} errorMap={dict.errors.map} lang={lang} />
  );
}
