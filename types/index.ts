// Tipos centrais da Futnex Club — espelham o schema do Supabase (supabase/migrations)
// Nenhum produto, time ou imagem deve ser hardcoded no frontend: tudo flui a partir destes tipos.

export type Continent = "America do Sul" | "Europa" | "America do Norte" | "Africa" | "Asia" | "Outro";

export interface Team {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  continent: Continent | null;
  league: string | null;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

export type ProductCategory = "casa" | "fora" | "alternativa" | "retro" | "selecao" | "outro";

export interface Product {
  id: string;
  name: string;
  slug: string;
  team_id: string;
  team?: Team;
  season: string | null;
  category: ProductCategory;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  allow_custom_name: boolean;
  allow_custom_number: boolean;
  max_name_characters: number;
  min_number: number;
  max_number: number;
  images?: ProductImage[];
  sizes?: ProductSize[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export type SizeLabel = "PP" | "P" | "M" | "G" | "GG" | "XG" | "XXG";

export interface ProductSize {
  id: string;
  product_id: string;
  size: SizeLabel;
  is_available: boolean;
}

export interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  link: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Settings {
  brand_name: string;
  slogan: string;
  whatsapp_number: string; // formato E.164, ex: 5511999999999
  instagram: string | null;
  tiktok: string | null;
  email: string | null;
  delivery_time_label: string; // ex: "15 a 20 dias úteis"
  logo_url: string | null;
  favicon_url: string | null;
  one_shirt_price: number;
  two_shirt_price: number;
  three_shirt_price: number;
}

export type OrderStatus =
  | "novo"
  | "aguardando_pagamento"
  | "pago"
  | "em_producao"
  | "enviado"
  | "entregue"
  | "cancelado";

export interface OrderItem {
  product_id: string;
  product_name: string;
  team_name: string;
  image_url: string | null;
  custom_name: string | null;
  custom_number: number | null;
  size: SizeLabel;
  unit_context_price?: number; // preço individual não se aplica em kit, mantido para referência
}

export interface Order {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  items: OrderItem[];
  quantity: number;
  total: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  status: OrderStatus;
  created_at: string;
}

// --- Estado do "kit" em construção no client (carrinho de personalização) ---
export interface KitItemDraft {
  id: string; // uuid local
  team: Pick<Team, "id" | "name" | "slug" | "logo_url"> | null;
  product: Pick<Product, "id" | "name" | "slug" | "price"> | null;
  imageUrl: string | null;
  customName: string;
  customNumber: string;
  size: SizeLabel | null;
}
