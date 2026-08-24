import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/catalogo`, priority: 0.9 },
    { url: `${base}/times`, priority: 0.8 },
    { url: `${base}/mais-vendidas`, priority: 0.7 },
    { url: `${base}/lancamentos`, priority: 0.7 },
  ];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return staticRoutes;

  const supabase = createClient();
  const [{ data: products }, { data: teams }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("teams").select("slug, updated_at").eq("is_active", true),
  ]);

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${base}/produto/${p.slug}`,
    lastModified: p.updated_at,
    priority: 0.6,
  }));

  const teamRoutes: MetadataRoute.Sitemap = (teams ?? []).map((t) => ({
    url: `${base}/times/${t.slug}`,
    lastModified: t.updated_at,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...teamRoutes];
}
