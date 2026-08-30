// import { NextResponse } from "next/server";
// export const dynamic = "force-dynamic";
// import { getProgrammes } from "@/lib/supabase-server";

// export async function GET() {
//   const programmes = await getProgrammes();
//   return NextResponse.json({ programmes });
// }

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { getProgrammes } from "@/lib/supabase-server";

export async function GET() {
  const programmes = await getProgrammes();
  return NextResponse.json(
    { programmes },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}