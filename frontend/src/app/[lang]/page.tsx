import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default async function LandingPage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar lang={lang} dict={dict.landing.nav} />
      <HeroSection lang={lang} dict={dict.landing.hero} />
      <FeaturesSection dict={dict.landing.features} />
      <CtaSection lang={lang} dict={dict.landing.cta} />
      <Footer dict={dict.landing.footer} />
    </div>
  );
}
