import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type CmsContent = {
  id: string;
  page: string;
  section: string;
  content: Record<string, unknown>;
  updated_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  status: "active" | "unsubscribed";
  source: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  submitted_at: string;
  is_read: boolean;
};

export type SiteSetting = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export type NewsletterCampaign = {
  id: string;
  subject: string;
  body: string;
  sent_at: string;
  recipient_count: number;
  status: "draft" | "sent";
};
