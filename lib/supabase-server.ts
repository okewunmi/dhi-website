// import { createClient } from "@supabase/supabase-js";

// // Server-side client with service role (full access, bypass RLS)
// export function createServerClient() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

//   return createClient(supabaseUrl, supabaseServiceKey, {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false,
//     },
//   });
// }

// // Helper: Get CMS content for a page/section
// export async function getCmsContent(page: string, section: string) {
//   const db = createServerClient();
//   const { data, error } = await db
//     .from("cms_content")
//     .select("content")
//     .eq("page", page)
//     .eq("section", section)
//     .single();

//   if (error || !data) return null;
//   return data.content;
// }

// // Helper: Get all CMS content for a page
// export async function getPageContent(page: string) {
//   const db = createServerClient();
//   const { data, error } = await db
//     .from("cms_content")
//     .select("section, content")
//     .eq("page", page);

//   if (error || !data) return {};

//   return data.reduce(
//     (acc, row) => {
//       acc[row.section] = row.content;
//       return acc;
//     },
//     {} as Record<string, Record<string, unknown>>
//   );
// }

// // Helper: Upsert CMS content
// export async function upsertCmsContent(
//   page: string,
//   section: string,
//   content: Record<string, unknown>
// ) {
//   const db = createServerClient();
//   const { error } = await db.from("cms_content").upsert(
//     { page, section, content, updated_at: new Date().toISOString() },
//     { onConflict: "page,section" }
//   );
//   return { error };
// }

// // Helper: Get site setting
// export async function getSiteSetting(key: string) {
//   const db = createServerClient();
//   const { data, error } = await db
//     .from("site_settings")
//     .select("value")
//     .eq("key", key)
//     .single();

//   if (error || !data) return null;
//   return data.value;
// }

// // Helper: Update site setting
// export async function updateSiteSetting(
//   key: string,
//   value: Record<string, unknown>
// ) {
//   const db = createServerClient();
//   const { error } = await db
//     .from("site_settings")
//     .upsert({ key, value, updated_at: new Date().toISOString() });
//   return { error };
// }

// // Public client for client-side reads
// import { createClient as createPublicClient } from "@supabase/supabase-js";
// export const publicDb = createPublicClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );






import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getCmsContent(page: string, section: string) {
  const db = createServerClient();
  const { data, error } = await db
    .from("cms_content")
    .select("content")
    .eq("page", page)
    .eq("section", section)
    .single();
  if (error || !data) return null;
  return data.content;
}

export async function getPageContent(page: string) {
  const db = createServerClient();
  const { data, error } = await db
    .from("cms_content")
    .select("section, content")
    .eq("page", page);
  if (error || !data) return {};
  return data.reduce(
    (acc, row) => {
      acc[row.section] = row.content;
      return acc;
    },
    {} as Record<string, Record<string, unknown>>
  );
}

export async function upsertCmsContent(
  page: string,
  section: string,
  content: Record<string, unknown>
) {
  const db = createServerClient();
  const { error } = await db.from("cms_content").upsert(
    { page, section, content, updated_at: new Date().toISOString() },
    { onConflict: "page,section" }
  );
  return { error };
}

export async function getSiteSetting(key: string) {
  const db = createServerClient();
  const { data, error } = await db
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  if (error || !data) return null;
  return data.value;
}

export async function updateSiteSetting(
  key: string,
  value: Record<string, unknown>
) {
  const db = createServerClient();
  const { error } = await db
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  return { error };
}

export async function getProgrammes(pillar?: string) {
  const db = createServerClient();
  let query = db
    .from("programmes")
    .select("*")
    .neq("status", "closed")
    .order("sort_order", { ascending: true });

  if (pillar) query = query.eq("pillar", pillar);

  const { data, error } = await query;
  if (error) {
    console.error("getProgrammes error:", error);
    return [];
  }
  return data || [];
}

export async function getAllProgrammes() {
  const db = createServerClient();
  const { data, error } = await db
    .from("programmes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getAllProgrammes error:", error);
    return [];
  }
  return data || [];
}

import { createClient as createPublicClient } from "@supabase/supabase-js";
export const publicDb = createPublicClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);