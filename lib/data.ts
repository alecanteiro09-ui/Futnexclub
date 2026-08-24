import { createClient } from "@/lib/supabase/server";
import { Product, Team, Collection } from "@/types";

/** Verdadeiro somente quando as variáveis do Supabase existem — evita quebrar o build local/demo. */
function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getFeaturedTeams(limit = 12): Promise<Team[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("getFeaturedTeams:", error.message);
    return [];
  }
  return (data ?? []) as Team[];
}

export async function getBestSellerProducts(limit = 8): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(*), team:teams(*)")
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .limit(limit);
  if (error) {
    console.error("getBestSellerProducts:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

export async function getActiveCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getActiveCollections:", error.message);
    return [];
  }
  return (data ?? []) as Collection[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(*), sizes:product_sizes(*), team:teams(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as unknown as Product;
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Team;
}

export async function getProductsByTeam(teamId: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("team_id", teamId)
    .eq("is_active", true);
  if (error) return [];
  return (data ?? []) as unknown as Product[];
}
