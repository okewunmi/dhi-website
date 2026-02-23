import { Metadata } from "next";
import { getSiteSetting } from "@/lib/supabase-server";
import PublicLayout from "@/components/PublicLayout";
import ApplyClient from "@/components/ApplyClient";

export const metadata: Metadata = { title: "Apply / Register" };
export const revalidate = 30;

export default async function ApplyPage() {
  const settings = (await getSiteSetting("apply_form_settings")) as Record<string, unknown> | null;

  const formConfig = {
    show_home_cfo_form: (settings?.show_home_cfo_form as boolean) ?? true,
    home_cfo_use_google_form: (settings?.home_cfo_use_google_form as boolean) ?? false,
    home_cfo_google_link: (settings?.home_cfo_google_link as string) || "",
    show_scholarship_form: (settings?.show_scholarship_form as boolean) ?? true,
    scholarship_use_google_form: (settings?.scholarship_use_google_form as boolean) ?? false,
    scholarship_google_link: (settings?.scholarship_google_link as string) || "",
    apply_page_intro: (settings?.apply_page_intro as string) || "Apply for our programmes and scholarships below. We look forward to hearing from you.",
  };

  return (
    <PublicLayout>
      <ApplyClient formConfig={formConfig} />
    </PublicLayout>
  );
}
