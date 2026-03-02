


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
//       home_videos: "YouTube Videos Carousel",
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

// // No revalidate — always fetch fresh from DB on each admin visit
// export const dynamic = "force-dynamic";

// export default async function CmsEditorPage({
//   params,
// }: {
//   params: { page: string };
// }) {
//   const pageMeta = PAGE_META[params.page];
//   if (!pageMeta) notFound();

//   return (
//     <div className="lg:mt-0 mt-14">
//       <div className="mb-8">
//         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CMS Editor</p>
//         <h1 className="font-display text-3xl font-light text-black">{pageMeta.title}</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Each section shows your currently saved content. Click <strong>Edit</strong> to modify, then <strong>Save</strong> to publish.
//         </p>
//       </div>

//       <CmsEditorClient
//         page={params.page}
//         sections={pageMeta.sections}
//       />
//     </div>
//   );
// }

import CmsEditorClient from "@/components/admin/CmsEditorClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

export default function CmsEditorPage({ params }: { params: { page: string } }) {
  const pageMeta = PAGE_META[params.page];
  if (!pageMeta) notFound();

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CMS Editor</p>
        <h1 className="font-display text-3xl font-light text-black">{pageMeta.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Expand a section to view saved content. Click <strong>Edit</strong> to make changes, then <strong>Save</strong> to publish.
        </p>
      </div>

      <CmsEditorClient page={params.page} sections={pageMeta.sections} />
    </div>
  );
}