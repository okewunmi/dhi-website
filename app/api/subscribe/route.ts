import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { sendWelcomeEmail } from "@/lib/resend";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;
    const db = createServerClient();

    // Check if already subscribed
    const { data: existing } = await db
      .from("subscribers")
      .select("id, status")
      .eq("email", email)
      .single();

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 409 }
        );
      }
      // Re-subscribe
      await db
        .from("subscribers")
        .update({ status: "active", name })
        .eq("email", email);
    } else {
      // Insert new subscriber
      const { error } = await db
        .from("subscribers")
        .insert({ email, name, source: "website" });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to subscribe. Please try again." },
          { status: 500 }
        );
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      // Don't fail the subscription if email fails
      console.error("Welcome email failed:", emailError);
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
