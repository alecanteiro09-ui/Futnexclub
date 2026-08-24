import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { BannerForm } from "@/components/admin/BannerForm";
import { deleteBanner, toggleBanner } from "@/lib/actions/banners";
import { Banner } from "@/types";

async function getAllBanners(): Promise<Banner[]> {
  const supabase = createClient();
  const { data } = await supabase.from("banners").select("*").order("sort_order");
  return (data ?? []) as Banner[];
}

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div>
      <h1 className="h2-display mb-8">Banners</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="card-surface flex gap-4 p-4">
              <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-base">
                <Image src={banner.image_url} alt={banner.title ?? "Banner"} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{banner.title ?? "Sem título"}</p>
                <p className="text-sm text-ink-muted">{banner.subtitle}</p>
                <p className="text-xs text-ink-muted">{banner.link}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${banner.is_active ? "bg-success/15 text-success" : "bg-ink-muted/15 text-ink-muted"}`}>
                  {banner.is_active ? "Ativo" : "Inativo"}
                </span>
                <div className="flex gap-3 text-xs">
                  <form action={toggleBanner.bind(null, banner.id, !banner.is_active)}>
                    <button type="submit" className="text-accent hover:underline">
                      {banner.is_active ? "Desativar" : "Ativar"}
                    </button>
                  </form>
                  <form action={deleteBanner.bind(null, banner.id)}>
                    <button type="submit" className="text-red-400 hover:underline">Excluir</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="card-surface p-8 text-center text-sm text-ink-muted">Nenhum banner cadastrado ainda.</div>
          )}
        </div>

        <BannerForm />
      </div>
    </div>
  );
}
