import Link from "next/link";
import { LayoutDashboard, Shirt, Shield, Layers, Tag, Image as ImageIcon, ClipboardList, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Shirt },
  { href: "/admin/times", label: "Times", icon: Shield },
  { href: "/admin/colecoes", label: "Coleções", icon: Layers },
  { href: "/admin/ofertas", label: "Ofertas", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

/**
 * Painel administrativo (seção 11-12, 62). Protegido via Supabase Auth + tabela admin_users.
 * Em produção real: se não houver sessão válida ou o usuário não estiver em admin_users, redireciona.
 * Aqui o gate é resiliente para o modo demo (sem Supabase configurado ainda).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminRecord) {
      redirect("/admin/login");
    }
  }

  return (
    <div className="flex min-h-screen bg-base">
      <aside className="hidden w-64 flex-shrink-0 border-r border-base-border p-6 lg:block">
        <p className="mb-8 font-display text-lg font-extrabold">
          FUTNEX <span className="text-accent">ADMIN</span>
        </p>
        <nav className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-base-soft hover:text-ink"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
