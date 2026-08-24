import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminConfiguracoesPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("settings").select("*").eq("id", 1).single();

  return (
    <div>
      <h1 className="h2-display mb-8">Configurações</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
