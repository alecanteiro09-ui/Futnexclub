"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangle className="h-10 w-10 text-red-400" />
      <div>
        <p className="font-display text-lg font-bold">Algo deu errado nesta página.</p>
        <p className="mt-1 max-w-md text-sm text-ink-muted">
          {error.message || "Ocorreu um erro inesperado."}
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="btn-primary">
          Tentar novamente
        </button>
        <Link href="/admin/produtos" className="btn-secondary">
          Voltar para produtos
        </Link>
      </div>
    </div>
  );
}
