import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage({
  params,
}: PageProps<"/[lang]/register">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <RegisterForm
      dict={dict.register}
      errorMap={dict.errors.map}
      lang={lang}
    />
  );
}
