import "server-only";

const dictionaries = {
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
