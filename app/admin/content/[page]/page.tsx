// import { getPageContent } from "@/lib/supabase-server";
// import CmsEditorClient from "@/components/admin/CmsEditorClient";
// import { notFound } from "next/navigation";

// const PAGE_META: Record<string, { title: string; sections: Record<string, string> }> = {
//   home: {
//     title: "Home Page",
//     sections: {
//       hero: "Hero Section",
//       pillars: "Our Two Pillars",
//       approaches: "How We Work",
//       about_preview: "About Preview",
//       programmes_preview: "Programmes Preview",
//       newsletter_cta: "Newsletter CTA",
//     },
//   },
//   about: {
//     title: "About Page",
//     sections: {
//       hero: "Hero Section",
//       why_dhi: "Why DHI Exists",
//       what_we_do: "What We Work On",
//       how_we_work: "How DHI Works",
//       focus_area: "Focus Area",
//     },
//   },
//   programmes: {
//     title: "Programmes Page",
//     sections: {
//       hero: "Hero Section",
//       financial_literacy: "Financial Literacy",
//       data_literacy: "Data Literacy",
//     },
//   },
//   more: {
//     title: "More Page",
//     sections: {
//       hero: "Hero Section",
//       resources: "Resources",
//       contact: "Contact Section",
//     },
//   },
// };

// export function generateStaticParams() {
//   return Object.keys(PAGE_META).map((page) => ({ page }));
// }

// export default async function CmsEditorPage({
//   params,
// }: {
//   params: { page: string };
// }) {
//   const pageMeta = PAGE_META[params.page];
//   if (!pageMeta) notFound();

//   const content = await getPageContent(params.page);

//   return (
//     <div className="lg:mt-0 mt-14">
//       <div className="mb-8">
//         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
//           CMS Editor
//         </p>
//         <h1 className="font-display text-3xl font-light text-black">
//           {pageMeta.title}
//         </h1>
//       </div>

//       <CmsEditorClient
//         page={params.page}
//         sections={pageMeta.sections}
//         initialContent={content}
//       />
//     </div>
//   );
// }

import { getPageContent } from "@/lib/supabase-server";
import CmsEditorClient from "@/components/admin/CmsEditorClient";
import { notFound } from "next/navigation";

const PAGE_META: Record<string, { title: string; sections: Record<string, string> }> = {
  home: {
    title: "Home Page",
    sections: {
      hero: "Hero Section",
      pillars: "Our Two Pillars",
      approaches: "How We Work",
      about_preview: "About Preview",
      home_videos: "YouTube Videos Carousel",
      newsletter_cta: "Newsletter CTA",
    },
  },
  about: {
    title: "About Page",
    sections: {
      hero: "Hero Section",
      why_dhi: "Why DHI Exists",
      what_we_do: "What We Work On",
      how_we_work: "How DHI Works",
      focus_area: "Focus Area",
    },
  },
  programmes: {
    title: "Programmes Page",
    sections: {
      hero: "Hero Section",
      financial_literacy: "Financial Literacy",
      data_literacy: "Data Literacy",
    },
  },
  more: {
    title: "More Page",
    sections: {
      hero: "Hero Section",
      resources: "Resources",
      contact: "Contact Section",
    },
  },
};

export function generateStaticParams() {
  return Object.keys(PAGE_META).map((page) => ({ page }));
}

export default async function CmsEditorPage({
  params,
}: {
  params: { page: string };
}) {
  const pageMeta = PAGE_META[params.page];
  if (!pageMeta) notFound();

  const content = await getPageContent(params.page);

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CMS Editor</p>
        <h1 className="font-display text-3xl font-light text-black">{pageMeta.title}</h1>
        {params.page === "home" && (
          <p className="text-xs text-[#BF4E14] mt-2 bg-[#FEF0E7] px-3 py-2 inline-block">
            💡 To manage YouTube videos on the home page, expand <strong>YouTube Videos Carousel</strong> below. Add thumbnail URL, YouTube link, title, and description per video.
          </p>
        )}
      </div>

      <CmsEditorClient
        page={params.page}
        sections={pageMeta.sections}
        initialContent={content}
      />
    </div>
  );
}