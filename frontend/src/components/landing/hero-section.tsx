import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  lang: string;
  dict: {
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
  };
}

export function HeroSection({ lang, dict }: HeroSectionProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {dict.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        {dict.subtitle}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" nativeButton={false} render={<Link href={`/${lang}/register`} />}>
          {dict.cta}
        </Button>
        <Button size="lg" variant="outline" nativeButton={false} render={<Link href={`/${lang}/login`} />}>
          {dict.secondaryCta}
        </Button>
      </div>
    </section>
  );
}
