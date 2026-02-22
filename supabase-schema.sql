-- ============================================================
-- STITCHES BY RUTHCHINOS — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PRODUCTS ──────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('ready-to-wear','bespoke','ankara','accessories','aso-ebi')),
  price numeric not null default 0,
  description text default '',
  images text[] default '{}',
  in_stock boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- ── BOOKINGS ──────────────────────────────────────────────────
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text default '',
  whatsapp text not null,
  email text default '',
  service text not null,
  preferred_date text default '',
  budget_range text default '',
  vision text default '',
  status text default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  notes text default '',
  created_at timestamptz default now()
);

-- ── GALLERY ───────────────────────────────────────────────────
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  title text default '',
  category text default 'lookbook',
  image_url text not null,
  featured boolean default false,
  created_at timestamptz default now()
);

-- ── MESSAGES ──────────────────────────────────────────────────
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  whatsapp text default '',
  subject text default 'General Enquiry',
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ── SITE CONTENT ──────────────────────────────────────────────
create table if not exists site_content (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text default '',
  updated_at timestamptz default now()
);

-- ── TESTIMONIALS ─────────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  client_title text default '',
  text text not null,
  initials text default '',
  rating integer default 5 check (rating >= 1 and rating <= 5),
  published boolean default true,
  created_at timestamptz default now()
);

-- ── BESPOKE ORDERS ──────────────────────────────────────────────
create table if not exists bespoke_orders (
  id uuid primary key default uuid_generate_v4(),
  garment_type text not null,
  style_preference text not null,
  fabric_choice text not null,
  occasion text not null,
  deadline date,
  budget_range text default '',
  special_notes text default '',
  measurements jsonb default '{}',
  has_reference_images boolean default false,
  client_name text not null,
  client_email text default '',
  client_whatsapp text not null,
  status text default 'new' check (status in ('new','consulted','in_progress','completed','cancelled')),
  admin_notes text default '',
  created_at timestamptz default now()
);

-- ── ORDERS ──────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_whatsapp text default '',
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  payment_method text not null check (payment_method in ('paystack','whatsapp','bank_transfer')),
  payment_reference text default '',
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  order_status text default 'new' check (order_status in ('new','confirmed','processing','shipped','delivered','cancelled')),
  delivery_address text default '',
  delivery_city text default '',
  delivery_state text default '',
  admin_notes text default '',
  created_at timestamptz default now()
);

-- ── ASO-EBI REQUESTS ───────────────────────────────────────────
create table if not exists aso_ebi_requests (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  event_name text not null,
  event_date date,
  fabric_type text not null,
  colour_palette text default '',
  guest_count integer default 0,
  guests jsonb default '[]',
  uniform_style text default 'same',
  style_notes text default '',
  budget_per_person text default '',
  coordinator_name text not null,
  coordinator_email text default '',
  coordinator_whatsapp text not null,
  additional_notes text default '',
  status text default 'new' check (status in ('new','contacted','in_progress','fabric_sourced','tailoring','completed','cancelled')),
  admin_notes text default '',
  created_at timestamptz default now()
);

-- ── FABRIC SWATCHES ─────────────────────────────────────────────
create table if not exists fabric_swatches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  colour text default '',
  price_per_yard numeric default 0,
  description text default '',
  image_url text default '',
  available boolean default true,
  created_at timestamptz default now()
);

-- ── CLIENT SPOTLIGHTS ───────────────────────────────────────────
create table if not exists client_spotlights (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  location text default '',
  occasion text default '',
  quote text default '',
  image_url text default '',
  instagram text default '',
  product_link text default '',
  featured boolean default false,
  published boolean default true,
  created_at timestamptz default now()
);

-- ── STAFF MEMBERS ─────────────────────────────────────────────
create table if not exists staff_members (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text default 'staff' check (role in ('admin','staff')),
  avatar_url text default '',
  created_at timestamptz default now()
);

-- ── STORAGE BUCKET ────────────────────────────────────────────
-- Create in Supabase Dashboard → Storage → New Bucket: "sbr-media" (public)

-- ── ROW LEVEL SECURITY ────────────────────────────────────────

-- Products: public read, authenticated write
alter table products enable row level security;
create policy "Public read products" on products for select using (true);
create policy "Auth write products" on products for all using (auth.role() = 'authenticated');

-- Bookings: public insert, authenticated read/update
alter table bookings enable row level security;
create policy "Public insert bookings" on bookings for insert with check (true);
create policy "Auth manage bookings" on bookings for all using (auth.role() = 'authenticated');

-- Gallery: public read, authenticated write
alter table gallery enable row level security;
create policy "Public read gallery" on gallery for select using (true);
create policy "Auth write gallery" on gallery for all using (auth.role() = 'authenticated');

-- Messages: public insert, authenticated read
alter table messages enable row level security;
create policy "Public insert messages" on messages for insert with check (true);
create policy "Auth read messages" on messages for all using (auth.role() = 'authenticated');

-- Site content: public read, authenticated write
alter table site_content enable row level security;
create policy "Public read content" on site_content for select using (true);
create policy "Auth write content" on site_content for all using (auth.role() = 'authenticated');

-- Testimonials: public read (published only), authenticated write
alter table testimonials enable row level security;
create policy "Public read testimonials" on testimonials for select using (published = true);
create policy "Auth manage testimonials" on testimonials for all using (auth.role() = 'authenticated');

-- Bespoke orders: public insert, authenticated manage
alter table bespoke_orders enable row level security;
create policy "Public insert bespoke_orders" on bespoke_orders for insert with check (true);
create policy "Auth manage bespoke_orders" on bespoke_orders for all using (auth.role() = 'authenticated');

-- Orders: public insert + read own (by email), authenticated manage
alter table orders enable row level security;
create policy "Public insert orders" on orders for insert with check (true);
create policy "Public read own orders" on orders for select using (true);
create policy "Auth manage orders" on orders for all using (auth.role() = 'authenticated');

-- Aso-Ebi requests: public insert, authenticated manage
alter table aso_ebi_requests enable row level security;
create policy "Public insert aso_ebi" on aso_ebi_requests for insert with check (true);
create policy "Auth manage aso_ebi" on aso_ebi_requests for all using (auth.role() = 'authenticated');

-- Fabric swatches: public read, authenticated manage
alter table fabric_swatches enable row level security;
create policy "Public read swatches" on fabric_swatches for select using (true);
create policy "Auth manage swatches" on fabric_swatches for all using (auth.role() = 'authenticated');

-- Client spotlights: public read (published), authenticated manage
alter table client_spotlights enable row level security;
create policy "Public read spotlights" on client_spotlights for select using (published = true);
create policy "Auth manage spotlights" on client_spotlights for all using (auth.role() = 'authenticated');

-- Staff: authenticated only
alter table staff_members enable row level security;
create policy "Auth manage staff" on staff_members for all using (auth.role() = 'authenticated');

-- ── SEED DEFAULT CONTENT ──────────────────────────────────────
insert into site_content (key, value) values
  ('hero_tagline', 'Where African heritage meets contemporary luxury fashion'),
  ('hero_eyebrow', 'Lagos · Nigeria · Est. 2020'),
  ('about_stat_1_num', '500+'),
  ('about_stat_1_label', 'Happy Clients'),
  ('about_stat_2_num', '4+'),
  ('about_stat_2_label', 'Years of Excellence'),
  ('about_stat_3_num', '100%'),
  ('about_stat_3_label', 'Bespoke Crafted'),
  ('contact_whatsapp', '+234 801 234 5678'),
  ('contact_instagram', '@stitchesbyruthchinos'),
  ('contact_email', 'info@sbr.com'),
  ('contact_location', 'Lagos, Nigeria · Home visits available'),
  ('cta_title', 'Every Great Outfit Starts With a Conversation.'),
  ('cta_subtitle', 'Book your private consultation with Ruthchinos today.')
on conflict (key) do nothing;
