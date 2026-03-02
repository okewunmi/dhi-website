// import { NextRequest, NextResponse } from "next/server";
// import { upsertCmsContent, getPageContent, createServerClient } from "@/lib/supabase-server";
// import { isAdminRequest } from "@/lib/auth";

// // GET - fetch page content
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const page = searchParams.get("page");

//   if (!page) {
//     return NextResponse.json({ error: "Page parameter required" }, { status: 400 });
//   }

//   const content = await getPageContent(page);
//   return NextResponse.json({ content });
// }

// // PUT - update section content
// export async function PUT(request: NextRequest) {
//   if (!isAdminRequest(request)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await request.json();
//     const { page, section, content } = body;

//     if (!page || !section || !content) {
//       return NextResponse.json(
//         { error: "page, section, and content are required" },
//         { status: 400 }
//       );
//     }

//     const { error } = await upsertCmsContent(page, section, content);

//     if (error) {
//       console.error("CMS update error:", error);
//       return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("CMS error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
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