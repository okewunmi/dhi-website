import { Metadata } from "next";
import { getPageContent } from "@/lib/supabase-server";
import PublicLayout from "@/components/PublicLayout";
import HomeHero from "@/components/home/HomeHero";
import HomePillars from "@/components/home/HomePillars";
import HomeApproaches from "@/components/home/HomeApproaches";
import HomeAboutPreview from "@/components/home/HomeAboutPreview";
import HomeProgrammesPreview from "@/components/home/HomeProgrammesPreview";
import HomeNewsletter from "@/components/home/HomeNewsletter";
import { getPageContent as getProgrammesContent } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Da Hausa Initiative – Simplifying Concepts, Strengthening Communities",
};

export const revalidate = 60;

export default async function HomePage() {
  const content = await getPageContent("home");
  const programmes = await getProgrammesContent("programmes");

  const hero = (content?.hero || {}) as Record<string, string>;
  const pillars = (content?.pillars || {}) as Record<string, unknown>;
  const approaches = (content?.approaches || {}) as Record<string, unknown>;
  const aboutPreview = (content?.about_preview || {}) as Record<string, string>;
  const programmesPreview = (content?.programmes_preview || {}) as Record<string, string>;
  const newsletterCta = (content?.newsletter_cta || {}) as Record<string, string>;
  const financialProgrammes = (programmes?.financial_literacy || {}) as Record<string, unknown>;
  const dataProgrammes = (programmes?.data_literacy || {}) as Record<string, unknown>;

  return (
    <PublicLayout>
      <HomeHero data={hero} />
      <HomePillars data={pillars} />
      <HomeApproaches data={approaches} />
      <HomeAboutPreview data={aboutPreview} />
      <HomeProgrammesPreview
        preview={programmesPreview}
        financial={financialProgrammes}
        data={dataProgrammes}
      />
      <HomeNewsletter data={newsletterCta} />
    </PublicLayout>
  );
}
