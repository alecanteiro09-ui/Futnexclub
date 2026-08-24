import { createClient } from "@/lib/supabase/server";
import { OffersForm } from "@/components/admin/OffersForm";

export default async function AdminOfertasPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("settings").select("*").eq("id", 1).single();

  return (
    <div>
      <h1 className="h2-display mb-2">Ofertas</h1>
      <p className="mb-8 text-sm text-ink-muted">
        Estes preços alimentam a seção "Escolha seu kit" da home, o resumo do pedido e a
        mensagem enviada pelo WhatsApp.
      </p>
      <OffersForm settings={settings} />
    </div>
  );
}
