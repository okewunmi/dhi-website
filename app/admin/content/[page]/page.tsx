// // import { getPageContent } from "@/lib/supabase-server";
// // import CmsEditorClient from "@/components/admin/CmsEditorClient";
// // import { notFound } from "next/navigation";

// // const PAGE_META: Record<string, { title: string; sections: Record<string, string> }> = {
// //   home: {
// //     title: "Home Page",
// //     sections: {
// //       hero: "Hero Section",
// //       pillars: "Our Two Pillars",
// //       approaches: "How We Work",
// //       about_preview: "About Preview",
// //       programmes_preview: "Programmes Preview",
// //       newsletter_cta: "Newsletter CTA",
// //     },
// //   },
// //   about: {
// //     title: "About Page",
// //     sections: {
// //       hero: "Hero Section",
// //       why_dhi: "Why DHI Exists",
// //       what_we_do: "What We Work On",
// //       how_we_work: "How DHI Works",
// //       focus_area: "Focus Area",
// //     },
// //   },
// //   programmes: {
// //     title: "Programmes Page",
// //     sections: {
// //       hero: "Hero Section",
// //       financial_literacy: "Financial Literacy",
// //       data_literacy: "Data Literacy",
// //     },
// //   },
// //   more: {
// //     title: "More Page",
// //     sections: {
// //       hero: "Hero Section",
// //       resources: "Resources",
// //       contact: "Contact Section",
// //     },
// //   },
// // };

// // export function generateStaticParams() {
// //   return Object.keys(PAGE_META).map((page) => ({ page }));
// // }

// // export default async function CmsEditorPage({
// //   params,
// // }: {
// //   params: { page: string };
// // }) {
// //   const pageMeta = PAGE_META[params.page];
// //   if (!pageMeta) notFound();

// //   const content = await getPageContent(params.page);

// //   return (
// //     <div className="lg:mt-0 mt-14">
// //       <div className="mb-8">
// //         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
// //           CMS Editor
// //         </p>
// //         <h1 className="font-display text-3xl font-light text-black">
// //           {pageMeta.title}
// //         </h1>
// //       </div>

// //       <CmsEditorClient
// //         page={params.page}
// //         sections={pageMeta.sections}
// //         initialContent={content}
// //       />
// //     </div>
// //   );
// // }


// // import { getPageContent } from "@/lib/supabase-server";
// // import CmsEditorClient from "@/components/admin/CmsEditorClient";
// // import { notFound } from "next/navigation";

// // const PAGE_META: Record<string, { title: string; sections: Record<string, string> }> = {
// //   home: {
// //     title: "Home Page",
// //     sections: {
// //       hero: "Hero Section",
// //       pillars: "Our Two Pillars",
// //       approaches: "How We Work",
// //       about_preview: "About Preview",
// //       home_videos: "YouTube Videos Carousel",
// //       newsletter_cta: "Newsletter CTA",
// //     },
// //   },
// //   about: {
// //     title: "About Page",
// //     sections: {
// //       hero: "Hero Section",
// //       why_dhi: "Why DHI Exists",
// //       what_we_do: "What We Work On",
// //       how_we_work: "How DHI Works",
// //       focus_area: "Focus Area",
// //     },
// //   },
// //   programmes: {
// //     title: "Programmes Page",
// //     sections: {
// //       hero: "Hero Section",
// //       financial_literacy: "Financial Literacy",
// //       data_literacy: "Data Literacy",
// //     },
// //   },
// //   more: {
// //     title: "More Page",
// //     sections: {
// //       hero: "Hero Section",
// //       resources: "Resources",
// //       contact: "Contact Section",
// //     },
// //   },
// // };

// // export function generateStaticParams() {
// //   return Object.keys(PAGE_META).map((page) => ({ page }));
// // }

// // export default async function CmsEditorPage({
// //   params,
// // }: {
// //   params: { page: string };
// // }) {
// //   const pageMeta = PAGE_META[params.page];
// //   if (!pageMeta) notFound();

// //   const content = await getPageContent(params.page);

// //   return (
// //     <div className="lg:mt-0 mt-14">
// //       <div className="mb-8">
// //         <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CMS Editor</p>
// //         <h1 className="font-display text-3xl font-light text-black">{pageMeta.title}</h1>
// //         {params.page === "home" && (
// //           <p className="text-xs text-[#BF4E14] mt-2 bg-[#FEF0E7] px-3 py-2 inline-block">
// //             💡 To manage YouTube videos on the home page, expand <strong>YouTube Videos Carousel</strong> below. Add thumbnail URL, YouTube link, title, and description per video.
// //           </p>
// //         )}
// //       </div>

// //       <CmsEditorClient
// //         page={params.page}
// //         sections={pageMeta.sections}
// //         initialContent={content}
// //       />
// //     </div>
// //   );
// // }


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

import { NextRequest, NextResponse } from "next/server";
import { upsertCmsContent, getCmsContent, createServerClient } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/auth";

// GET - fetch a single section's content (used by CMS editor client)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const section = searchParams.get("section");

  if (!page) {
    return NextResponse.json({ error: "page parameter required" }, { status: 400 });
  }

  // If section specified, return just that section's content
  if (section) {
    const content = await getCmsContent(page, section);
    return NextResponse.json({ content: content || {} });
  }

  // Otherwise return full page content
  const db = createServerClient();
  const { data, error } = await db
    .from("cms_content")
    .select("section, content")
    .eq("page", page);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }

  const result = (data || []).reduce(
    (acc, row) => { acc[row.section] = row.content; return acc; },
    {} as Record<string, unknown>
  );

  return NextResponse.json({ content: result });
}

// PUT - save/update a section
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page, section, content } = await request.json();

    if (!page || !section || content === undefined) {
      return NextResponse.json({ error: "page, section, and content are required" }, { status: 400 });
    }

    const { error } = await upsertCmsContent(page, section, content);

    if (error) {
      console.error("CMS update error:", error);
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CMS error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - delete a section entirely
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page, section } = await request.json();
    if (!page || !section) {
      return NextResponse.json({ error: "page and section required" }, { status: 400 });
    }

    const db = createServerClient();
    const { error } = await db
      .from("cms_content")
      .delete()
      .eq("page", page)
      .eq("section", section);

    if (error) {
      return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}