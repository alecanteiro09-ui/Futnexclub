"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <form onSubmit={handleSubmit} className="card-surface w-full max-w-sm space-y-4 p-8">
        <p className="font-display text-xl font-extrabold">
          FUTNEX <span className="text-accent">ADMIN</span>
        </p>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-base-border bg-base px-4 py-3 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
