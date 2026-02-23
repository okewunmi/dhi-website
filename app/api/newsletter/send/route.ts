import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendNewsletterEmail } from "@/lib/resend";
import { isAdminRequest } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  subject: z.string().min(1, "Subject required"),
  body: z.string().min(1, "Body required"),
});

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Get all active subscribers
    const { data: subscribers, error: fetchError } = await db
      .from("subscribers")
      .select("email, name")
      .eq("status", "active");

    if (fetchError || !subscribers) {
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
    }

    // Send emails (batch with small delay to respect rate limits)
    let sent = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      try {
        await sendNewsletterEmail(sub.email, parsed.data.subject, parsed.data.body, sub.name);
        sent++;
        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 100));
      } catch (err) {
        errors.push(sub.email);
        console.error(`Failed to send to ${sub.email}:`, err);
      }
    }

    // Record campaign
    await db.from("newsletter_campaigns").insert({
      subject: parsed.data.subject,
      body: parsed.data.body,
      recipient_count: sent,
      status: "sent",
    });

    return NextResponse.json({
      success: true,
      sent,
      failed: errors.length,
      total: subscribers.length,
    });
  } catch (err) {
    console.error("Newsletter send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
