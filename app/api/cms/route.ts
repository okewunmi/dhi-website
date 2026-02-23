import { NextRequest, NextResponse } from "next/server";
import { upsertCmsContent, getPageContent, createServerClient } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/auth";

// GET - fetch page content
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  if (!page) {
    return NextResponse.json({ error: "Page parameter required" }, { status: 400 });
  }

  const content = await getPageContent(page);
  return NextResponse.json({ content });
}

// PUT - update section content
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { page, section, content } = body;

    if (!page || !section || !content) {
      return NextResponse.json(
        { error: "page, section, and content are required" },
        { status: 400 }
      );
    }

    const { error } = await upsertCmsContent(page, section, content);

    if (error) {
      console.error("CMS update error:", error);
      return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CMS error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
