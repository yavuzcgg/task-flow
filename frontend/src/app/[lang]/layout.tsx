import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { HtmlLangSetter } from "@/components/html-lang-setter";
import { DictionaryProvider } from "@/providers/dictionary-provider";

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <HtmlLangSetter lang={lang} />
      <DictionaryProvider dictionary={dict}>
        {children}
      </DictionaryProvider>
    </>
  );
}
