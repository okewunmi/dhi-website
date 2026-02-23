import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  state: z.string().min(1, "State is required"),
  motivation: z.string().min(20, "Please provide more detail"),
  form_type: z.enum(["home_cfo", "scholarship"]),
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

    const db = createServerClient();

    // Save as a contact submission with the form type in subject
    const { error } = await db.from("contact_submissions").insert({
      name: parsed.data.full_name,
      email: parsed.data.email,
      subject: `Application: ${parsed.data.form_type === "home_cfo" ? "Home CFO Course" : "Hausa Tech Training Scholarship"}`,
      message: `Phone: ${parsed.data.phone || "N/A"}\nState: ${parsed.data.state}\n\nMotivation:\n${parsed.data.motivation}`,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to submit application." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
