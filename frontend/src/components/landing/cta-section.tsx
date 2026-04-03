import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  lang: string;
  dict: {
    title: string;
    subtitle: string;
    button: string;
  };
}

export function CtaSection({ lang, dict }: CtaSectionProps) {
  return (
    <section className="px-4 py-20 text-center sm:py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {dict.title}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{dict.subtitle}</p>
        <div className="mt-8">
          <Button size="lg" nativeButton={false} render={<Link href={`/${lang}/register`} />}>
            {dict.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
