-- FUTNEX CLUB — schema inicial
-- Rodar via: supabase db push  (ou colar no SQL editor do Supabase)

create extension if not exists "pgcrypto";

-- ========== TEAMS ==========
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text,
  continent text,
  league text,
  logo_url text,
  description text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_teams_slug on teams (slug);
create index if not exists idx_teams_is_active on teams (is_active);

-- ========== COLLECTIONS ==========
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_collections_slug on collections (slug);

-- ========== PRODUCTS ==========
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  team_id uuid not null references teams (id) on delete restrict,
  season text,
  category text not null default 'outro'
    check (category in ('casa','fora','alternativa','retro','selecao','outro')),
  description text,
  price numeric(10,2) not null default 149.90,
  compare_at_price numeric(10,2),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  allow_custom_name boolean not null default true,
  allow_custom_number boolean not null default true,
  max_name_characters int not null default 12,
  min_number int not null default 1,
  max_number int not null default 99,
  is_demo boolean not null default false, -- produtos DEMO devem ficar marcados (seção 58 do briefing)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_slug on products (slug);
create index if not exists idx_products_team_id on products (team_id);
create index if not exists idx_products_is_active on products (is_active);
create index if not exists idx_products_is_featured on products (is_featured);
create index if not exists idx_products_is_best_seller on products (is_best_seller);

-- ========== PRODUCT <-> COLLECTIONS (N:N) ==========
create table if not exists product_collections (
  product_id uuid not null references products (id) on delete cascade,
  collection_id uuid not null references collections (id) on delete cascade,
  primary key (product_id, collection_id)
);
create index if not exists idx_product_collections_collection_id on product_collections (collection_id);

-- ========== PRODUCT IMAGES ==========
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_images_product_id on product_images (product_id);

-- ========== SIZES (catálogo global + disponibilidade por produto) ==========
create table if not exists sizes (
  code text primary key, -- PP, P, M, G, GG, XG, XXG
  label text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists product_sizes (
  product_id uuid not null references products (id) on delete cascade,
  size_code text not null references sizes (code),
  is_available boolean not null default true,
  primary key (product_id, size_code)
);
create index if not exists idx_product_sizes_product_id on product_sizes (product_id);

-- ========== BANNERS ==========
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  subtitle text,
  cta_label text,
  link text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ========== SETTINGS (singleton) ==========
create table if not exists settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Futnex Club',
  slogan text not null default 'Seu time. Seu nome. Sua camisa.',
  whatsapp_number text not null default '',
  instagram text,
  tiktok text,
  email text,
  delivery_time_label text not null default '15 a 20 dias úteis',
  logo_url text,
  favicon_url text,
  one_shirt_price numeric(10,2) not null default 149.90,
  two_shirt_price numeric(10,2) not null default 229.99,
  three_shirt_price numeric(10,2) not null default 349.99,
  updated_at timestamptz not null default now()
);
insert into settings (id) values (1) on conflict (id) do nothing;

-- ========== ORDERS (pedidos iniciados via WhatsApp) ==========
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  quantity int not null,
  total numeric(10,2) not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  status text not null default 'novo'
    check (status in ('novo','aguardando_pagamento','pago','em_producao','enviado','entregue','cancelado')),
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_status on orders (status);
create index if not exists idx_orders_created_at on orders (created_at);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  team_name text not null,
  image_url text,
  custom_name text,
  custom_number int,
  size_code text
);
create index if not exists idx_order_items_order_id on order_items (order_id);

-- ========== ADMIN USERS (perfis autorizados a acessar /admin) ==========
create table if not exists admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table teams enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table product_collections enable row level security;
alter table product_images enable row level security;
alter table sizes enable row level security;
alter table product_sizes enable row level security;
alter table banners enable row level security;
alter table settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table admin_users enable row level security;

-- Leitura pública apenas de dados ativos
create policy "public_read_teams" on teams for select using (is_active = true);
create policy "public_read_collections" on collections for select using (is_active = true);
create policy "public_read_products" on products for select using (is_active = true);
create policy "public_read_product_collections" on product_collections for select using (true);
create policy "public_read_product_images" on product_images for select using (true);
create policy "public_read_sizes" on sizes for select using (is_active = true);
create policy "public_read_product_sizes" on product_sizes for select using (true);
create policy "public_read_banners" on banners for select using (is_active = true);
create policy "public_read_settings" on settings for select using (true);

-- Visitantes podem criar pedidos (clique no WhatsApp), mas não ler/editar pedidos de terceiros
create policy "public_insert_orders" on orders for insert with check (true);
create policy "public_insert_order_items" on order_items for insert with check (true);

-- Helper: usuário autenticado é admin?
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$ language sql stable security definer;

-- Admin tem controle total
create policy "admin_all_teams" on teams for all using (is_admin()) with check (is_admin());
create policy "admin_all_collections" on collections for all using (is_admin()) with check (is_admin());
create policy "admin_all_products" on products for all using (is_admin()) with check (is_admin());
create policy "admin_all_product_collections" on product_collections for all using (is_admin()) with check (is_admin());
create policy "admin_all_product_images" on product_images for all using (is_admin()) with check (is_admin());
create policy "admin_all_sizes" on sizes for all using (is_admin()) with check (is_admin());
create policy "admin_all_product_sizes" on product_sizes for all using (is_admin()) with check (is_admin());
create policy "admin_all_banners" on banners for all using (is_admin()) with check (is_admin());
create policy "admin_all_settings" on settings for all using (is_admin()) with check (is_admin());
create policy "admin_all_orders" on orders for all using (is_admin()) with check (is_admin());
create policy "admin_all_order_items" on order_items for all using (is_admin()) with check (is_admin());
create policy "admin_read_admin_users" on admin_users for select using (is_admin());

-- =====================================================================
-- STORAGE BUCKETS (executar também via painel Supabase > Storage)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('teams', 'teams', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('products', 'products', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('collections', 'collections', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('banners', 'banners', true) on conflict (id) do nothing;

create policy "public_read_storage" on storage.objects for select using (
  bucket_id in ('teams','products','collections','banners')
);
create policy "admin_write_storage" on storage.objects for all using (
  bucket_id in ('teams','products','collections','banners') and is_admin()
) with check (
  bucket_id in ('teams','products','collections','banners') and is_admin()
);
