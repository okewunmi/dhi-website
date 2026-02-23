-- ============================================================
-- Da Hausa Initiative – Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CMS CONTENT TABLE
-- Stores all editable content per page/section as JSON
-- ============================================================
create table if not exists cms_content (
  id uuid default uuid_generate_v4() primary key,
  page text not null,
  section text not null,
  content jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(page, section)
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cms_content_updated_at
  before update on cms_content
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- SUBSCRIBERS TABLE
-- ============================================================
create table if not exists subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  subscribed_at timestamptz default now(),
  status text default 'active' check (status in ('active', 'unsubscribed')),
  source text default 'website'
);

-- ============================================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================================
create table if not exists contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  submitted_at timestamptz default now(),
  is_read boolean default false
);

-- ============================================================
-- SITE SETTINGS TABLE
-- Key/value store for global settings
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- NEWSLETTER CAMPAIGNS TABLE
-- Tracks sent newsletter campaigns
-- ============================================================
create table if not exists newsletter_campaigns (
  id uuid default uuid_generate_v4() primary key,
  subject text not null,
  body text not null,
  sent_at timestamptz default now(),
  recipient_count integer default 0,
  status text default 'sent' check (status in ('draft', 'sent'))
);

-- ============================================================
-- SEED DEFAULT SETTINGS
-- ============================================================

-- Form settings
insert into site_settings (key, value) values
(
  'apply_form_settings',
  '{
    "show_home_cfo_form": true,
    "home_cfo_use_google_form": false,
    "home_cfo_google_link": "",
    "show_scholarship_form": true,
    "scholarship_use_google_form": false,
    "scholarship_google_link": "",
    "apply_page_intro": "Apply for our programmes and scholarships below. We look forward to hearing from you."
  }'::jsonb
),
(
  'site_info',
  '{
    "site_name": "Da Hausa Initiative",
    "tagline": "Simplifying concepts, Strengthening communities",
    "email": "info@dahausa.org",
    "phone": "",
    "address": "FCT, Nigeria",
    "twitter": "",
    "facebook": "",
    "instagram": "",
    "linkedin": "",
    "youtube": ""
  }'::jsonb
),
(
  'newsletter_settings',
  '{
    "show_newsletter_section": true,
    "newsletter_headline": "Stay Informed",
    "newsletter_description": "Get updates on our programmes, research, and resources delivered to your inbox.",
    "newsletter_cta": "Subscribe"
  }'::jsonb
)
on conflict (key) do nothing;

-- ============================================================
-- SEED DEFAULT CMS CONTENT
-- ============================================================

-- Home Page
insert into cms_content (page, section, content) values
(
  'home', 'hero',
  '{
    "headline": "Simplifying Concepts,\nStrengthening Communities",
    "subheadline": "Da Hausa Initiative (DHI) works to improve financial and data literacy across Hausa-speaking communities in Northern Nigeria through research, training, and advocacy.",
    "cta_primary_text": "Apply Now",
    "cta_primary_link": "/apply",
    "cta_secondary_text": "Our Programmes",
    "cta_secondary_link": "/programmes",
    "image_url": ""
  }'::jsonb
),
(
  'home', 'pillars',
  '{
    "headline": "Our Two Pillars",
    "pillars": [
      {
        "title": "Financial Literacy",
        "description": "Equipping individuals and households in Northern Nigeria with the knowledge and tools to manage money, plan for the future, and build financial resilience.",
        "icon": "TrendingUp"
      },
      {
        "title": "Data Literacy",
        "description": "Building capacity to understand, interpret, and use data — empowering Hausa-speaking communities to engage with evidence and make informed decisions.",
        "icon": "BarChart2"
      }
    ]
  }'::jsonb
),
(
  'home', 'approaches',
  '{
    "headline": "How We Work",
    "approaches": [
      {
        "title": "Research",
        "description": "Generating evidence on the financial and data needs of Northern Nigerian communities to inform effective interventions."
      },
      {
        "title": "Training",
        "description": "Delivering practical, community-rooted programmes that build real skills in financial and data literacy."
      },
      {
        "title": "Advocacy",
        "description": "Influencing policy and practice to create systemic change that benefits underserved Hausa-speaking populations."
      }
    ]
  }'::jsonb
),
(
  'home', 'about_preview',
  '{
    "headline": "About Da Hausa Initiative",
    "body": "Da Hausa Initiative (DHI) exists to address the literacy gaps that hold communities back. We focus on Northern Nigeria — a region rich in potential but historically underserved by mainstream financial and digital systems. Through targeted research, practical training, and evidence-based advocacy, we equip people with the concepts they need to thrive.",
    "cta_text": "Learn More About Us",
    "cta_link": "/about",
    "image_url": ""
  }'::jsonb
),
(
  'home', 'programmes_preview',
  '{
    "headline": "Our Programmes",
    "subheadline": "From podcasts to scholarships, our programmes meet communities where they are.",
    "cta_text": "View All Programmes",
    "cta_link": "/programmes"
  }'::jsonb
),
(
  'home', 'newsletter_cta',
  '{
    "headline": "Stay Connected",
    "body": "Join our newsletter for updates on programmes, research, and resources tailored for Northern Nigeria.",
    "cta_text": "Subscribe to Newsletter",
    "cta_link": "/more#newsletter"
  }'::jsonb
)
on conflict (page, section) do nothing;

-- About Page
insert into cms_content (page, section, content) values
(
  'about', 'hero',
  '{
    "headline": "About Da Hausa Initiative",
    "subheadline": "We exist because literacy — in all its forms — is the foundation of a thriving community.",
    "image_url": ""
  }'::jsonb
),
(
  'about', 'why_dhi',
  '{
    "headline": "Why DHI Exists",
    "body": "Northern Nigeria is home to millions of Hausa-speaking people who are largely excluded from mainstream financial systems and digital literacy programmes. The gap is not one of ability — it is one of access. DHI exists to close that gap. We believe that when communities understand money and data, they make better decisions, advocate for their rights, and build stronger futures."
  }'::jsonb
),
(
  'about', 'what_we_do',
  '{
    "headline": "What We Work On",
    "items": [
      {
        "title": "Financial Literacy",
        "description": "Teaching practical money management, budgeting, and financial planning skills in a culturally relevant way for Hausa-speaking communities."
      },
      {
        "title": "Data Literacy",
        "description": "Equipping individuals and organisations with the ability to read, interpret, and use data effectively — in Hausa and English."
      }
    ]
  }'::jsonb
),
(
  'about', 'how_we_work',
  '{
    "headline": "How DHI Works",
    "body": "We operate through three complementary approaches — Research, Training, and Advocacy — that together create lasting change.",
    "approaches": [
      {
        "title": "Research",
        "description": "We generate evidence on community needs, programme effectiveness, and policy gaps. Our research is community-led, context-specific, and action-oriented."
      },
      {
        "title": "Training",
        "description": "We design and deliver training programmes that are practical, affordable, and accessible — including online, in-person, and hybrid formats."
      },
      {
        "title": "Advocacy",
        "description": "We use our research and programme experience to advocate for policies that expand access to financial and data literacy across Northern Nigeria."
      }
    ]
  }'::jsonb
),
(
  'about', 'focus_area',
  '{
    "headline": "Our Focus: Northern Nigeria",
    "body": "DHI''s work is rooted in the Hausa-speaking communities of Northern Nigeria. We understand the cultural, linguistic, and economic context of this region, and we design all our programmes with that understanding at the centre. Our approach is community-rooted, evidence-informed, and deeply practical.",
    "image_url": ""
  }'::jsonb
)
on conflict (page, section) do nothing;

-- Programmes Page
insert into cms_content (page, section, content) values
(
  'programmes', 'hero',
  '{
    "headline": "Our Programmes",
    "subheadline": "Two pillars. One mission. Practical learning for real impact in Northern Nigeria."
  }'::jsonb
),
(
  'programmes', 'financial_literacy',
  '{
    "headline": "Financial Literacy Programmes",
    "description": "Helping individuals and households understand money, build skills, and make confident financial decisions.",
    "programmes": [
      {
        "title": "Future Focus with Lailah",
        "subtitle": "Podcast",
        "description": "A podcast series exploring personal finance, economic empowerment, and financial planning — designed specifically for Hausa-speaking audiences. Episodes are practical, accessible, and action-oriented.",
        "cta_text": "Listen Now",
        "cta_link": "#",
        "badge": "Podcast",
        "status": "active"
      },
      {
        "title": "Home CFO Course",
        "subtitle": "Online Course",
        "description": "A structured course that teaches households how to manage money like a Chief Financial Officer. Topics include budgeting, savings, debt management, and financial goal-setting.",
        "cta_text": "Apply Now",
        "cta_link": "/apply",
        "badge": "Course",
        "status": "active"
      },
      {
        "title": "15-Minute Financial Clarity Calls",
        "subtitle": "1-on-1 Coaching",
        "description": "Short, focused coaching calls that give individuals a clear picture of their financial situation and practical next steps. Free to access, no financial jargon.",
        "cta_text": "Register Interest",
        "cta_link": "/apply",
        "badge": "Coaching",
        "status": "active"
      }
    ]
  }'::jsonb
),
(
  'programmes', 'data_literacy',
  '{
    "headline": "Data Literacy Programmes",
    "description": "Building the capacity to understand, use, and advocate with data across Hausa-speaking communities.",
    "programmes": [
      {
        "title": "Hausa Tech Training Scholarship",
        "subtitle": "Scholarship Programme",
        "description": "A scholarship providing access to technical training in data analysis, Excel, and Power BI for qualified applicants from Northern Nigeria. Designed to open pathways into the data economy.",
        "cta_text": "Apply for Scholarship",
        "cta_link": "/apply",
        "badge": "Scholarship",
        "status": "active"
      },
      {
        "title": "Research on Data in Northern Nigeria",
        "subtitle": "Research Initiative",
        "description": "Ongoing research examining how data is produced, used, and misused in Northern Nigeria — and what this means for policy, advocacy, and community empowerment.",
        "cta_text": "View Research",
        "cta_link": "/more#resources",
        "badge": "Research",
        "status": "active"
      },
      {
        "title": "Hausa Excel & Power BI Videos",
        "subtitle": "Video Learning",
        "description": "A growing library of Excel and Power BI tutorial videos produced in Hausa — making data skills accessible to those who learn best in their first language.",
        "cta_text": "Watch on YouTube",
        "cta_link": "#",
        "badge": "Videos",
        "status": "active"
      }
    ]
  }'::jsonb
)
on conflict (page, section) do nothing;

-- More Page (Resources + Newsletter + Contact)
insert into cms_content (page, section, content) values
(
  'more', 'hero',
  '{
    "headline": "Resources, Newsletter & Contact",
    "subheadline": "Explore our resources, stay connected through our newsletter, and reach out to us."
  }'::jsonb
),
(
  'more', 'resources',
  '{
    "headline": "Resources",
    "description": "Explore our collection of podcasts, videos, research papers, and more.",
    "resources": [
      {
        "title": "Future Focus with Lailah",
        "type": "Podcast",
        "description": "Listen to our financial literacy podcast series.",
        "link": "#",
        "icon": "Mic"
      },
      {
        "title": "Hausa Excel & Power BI Videos",
        "type": "Videos",
        "description": "Data literacy video tutorials in Hausa on YouTube.",
        "link": "#",
        "icon": "Youtube"
      },
      {
        "title": "Policy Papers",
        "type": "Research",
        "description": "Research and policy papers on financial and data literacy in Northern Nigeria.",
        "link": "#",
        "icon": "FileText"
      },
      {
        "title": "DHI Documentary",
        "type": "Documentary",
        "description": "A documentary on our work and community impact. Coming soon.",
        "link": "#",
        "icon": "Film",
        "coming_soon": true
      }
    ]
  }'::jsonb
),
(
  'more', 'contact',
  '{
    "headline": "Get in Touch",
    "description": "Have a question, partnership inquiry, or want to learn more about our work? We''d love to hear from you.",
    "email": "info@dahausa.org",
    "address": "FCT, Nigeria",
    "show_contact_form": true
  }'::jsonb
)
on conflict (page, section) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table cms_content enable row level security;
alter table subscribers enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings enable row level security;
alter table newsletter_campaigns enable row level security;

-- Public read for CMS content
create policy "Public can read CMS content" on cms_content
  for select using (true);

-- Service role can do everything (used by server-side API routes)
create policy "Service role full access cms" on cms_content
  for all using (auth.role() = 'service_role');

create policy "Service role full access subscribers" on subscribers
  for all using (auth.role() = 'service_role');

create policy "Service role full access contacts" on contact_submissions
  for all using (auth.role() = 'service_role');

create policy "Service role full access settings" on site_settings
  for all using (auth.role() = 'service_role');

-- Public read settings
create policy "Public can read site settings" on site_settings
  for select using (true);

create policy "Service role full access campaigns" on newsletter_campaigns
  for all using (auth.role() = 'service_role');

-- ============================================================
-- STORAGE BUCKET (run separately or via Supabase dashboard)
-- ============================================================
-- Create a bucket called 'media' in Supabase Storage
-- and set it to public reads.
-- insert into storage.buckets (id, name, public)
-- values ('media', 'media', true);
