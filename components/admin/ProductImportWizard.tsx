"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Upload, Download, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { importProducts, ImportSummary } from "@/lib/actions/import";
import { parseProductImportCsv, ParseResult, hasBlockingIssues } from "@/lib/import/productImport";
import { stringifyCsv } from "@/lib/import/csv";

const INITIAL_STATE: ImportSummary = { totalGroups: 0, created: 0, updated: 0, failed: 0, results: [] };

export function ProductImportWizard() {
  const [state, formAction] = useFormState<ImportSummary, FormData>(importProducts, INITIAL_STATE);
  const [preview, setPreview] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const validCount = useMemo(() => preview?.groups.filter((g) => !hasBlockingIssues(g)).length ?? 0, [preview]);
  const errorCount = useMemo(() => preview?.groups.filter((g) => hasBlockingIssues(g)).length ?? 0, [preview]);
  const imageCount = useMemo(() => preview?.groups.reduce((acc, g) => acc + g.images.length, 0) ?? 0, [preview]);

  async function handleFile(file: File | null) {
    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }
    setParsing(true);
    setFileName(file.name);
    try {
      const text = await file.text();
      setPreview(parseProductImportCsv(text));
    } catch (err) {
      setPreview({
        groups: [],
        totalRows: 0,
        fatalError: err instanceof Error ? `Não foi possível ler o arquivo: ${err.message}` : "Não foi possível ler o arquivo.",
      });
    } finally {
      setParsing(false);
    }
  }

  function downloadErrorReport() {
    if (!state.results.length) return;
    const rows = [
      ["Produto", "Status", "Mensagens"],
      ...state.results
        .filter((r) => r.status === "error" || r.messages.length > 0)
        .map((r) => [r.title, r.status, r.messages.join(" | ")]),
    ];
    const blob = new Blob([stringifyCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-importacao.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasResult = state.results.length > 0 || Boolean(state.error);

  return (
    <div className="max-w-3xl space-y-6">
      {!hasResult && (
        <form action={formAction} className="space-y-6">
          <div className="card-surface space-y-4 p-6">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-base-border px-6 py-10 text-center transition-colors hover:border-accent/50">
              <Upload className="h-6 w-6 text-ink-muted" />
              <span className="text-sm font-semibold text-ink">{fileName ?? "Clique para escolher um arquivo .csv"}</span>
              <span className="text-xs text-ink-muted">Ou exporte diretamente da Shopify (products_export.csv)</span>
              <input
                type="file"
                name="csv_file"
                accept=".csv,text/csv"
                required
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {parsing && (
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Lendo arquivo...
            </p>
          )}

          {preview && !parsing && (
            <div className="card-surface space-y-4 p-6">
              {preview.fatalError ? (
                <p className="flex items-center gap-2 text-sm text-red-400">
                  <XCircle className="h-4 w-4" /> {preview.fatalError}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <Stat label="Produtos prontos" value={validCount} tone="success" />
                    <Stat label="Com erro" value={errorCount} tone="error" />
                    <Stat label="Imagens" value={imageCount} tone="neutral" />
                  </div>

                  <div className="max-h-96 overflow-y-auto rounded-lg border border-base-border">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 border-b border-base-border bg-base-soft text-ink-muted">
                        <tr>
                          <th className="p-2">Produto</th>
                          <th className="p-2">Time</th>
                          <th className="p-2">Preço</th>
                          <th className="p-2">Imagens</th>
                          <th className="p-2">Tamanhos</th>
                          <th className="p-2">Avisos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.groups.map((g) => (
                          <tr key={g.key} className="border-b border-base-border last:border-0">
                            <td className="p-2 font-medium">
                              {hasBlockingIssues(g) ? (
                                <XCircle className="mr-1 inline h-3.5 w-3.5 text-red-400" />
                              ) : (
                                <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-success" />
                              )}
                              {g.title || g.key}
                            </td>
                            <td className="p-2 text-ink-muted">{g.teamName || "-"}</td>
                            <td className="p-2 text-ink-muted">R$ {g.price.toFixed(2)}</td>
                            <td className="p-2 text-ink-muted">{g.images.length}</td>
                            <td className="p-2 text-ink-muted">{g.sizes.join(", ") || "-"}</td>
                            <td className="p-2 text-ink-muted">
                              {g.issues.length > 0 && (
                                <span className="inline-flex items-center gap-1" title={g.issues.map((i) => i.message).join("\n")}>
                                  <AlertTriangle className="h-3.5 w-3.5 text-gold" /> {g.issues.length}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-ink-muted">
                    Times que ainda não existirem serão criados automaticamente. Produtos com o mesmo nome + time +
                    temporada de um já cadastrado serão atualizados em vez de duplicados.
                  </p>

                  <SubmitButton disabled={validCount === 0} count={validCount} />
                </>
              )}
            </div>
          )}
        </form>
      )}

      {hasResult && (
        <div className="card-surface space-y-4 p-6">
          {state.error ? (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <XCircle className="h-4 w-4" /> {state.error}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 text-center">
                <Stat label="Criados" value={state.created} tone="success" />
                <Stat label="Atualizados" value={state.updated} tone="neutral" />
                <Stat label="Falharam" value={state.failed} tone="error" />
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border border-base-border">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 border-b border-base-border bg-base-soft text-ink-muted">
                    <tr>
                      <th className="p-2">Produto</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Mensagens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.results.map((r) => (
                      <tr key={r.key} className="border-b border-base-border last:border-0">
                        <td className="p-2 font-medium">{r.title}</td>
                        <td className="p-2">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="p-2 text-ink-muted">{r.messages.join(" · ") || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={downloadErrorReport} className="btn-secondary">
                  <Download className="h-4 w-4" /> Baixar relatório
                </button>
                <Link href="/admin/produtos" className="btn-primary">
                  Ver produtos
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "success" | "error" | "neutral" }) {
  const color = tone === "success" ? "text-success" : tone === "error" ? "text-red-400" : "text-ink";
  return (
    <div className="rounded-xl border border-base-border p-4">
      <p className={`font-display text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    created: "bg-success/15 text-success",
    updated: "bg-accent/15 text-accent",
    error: "bg-red-500/15 text-red-400",
  };
  const label: Record<string, string> = { created: "Criado", updated: "Atualizado", error: "Erro" };
  return <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tone[status] ?? ""}`}>{label[status] ?? status}</span>;
}

function SubmitButton({ disabled, count }: { disabled: boolean; count: number }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={disabled || pending} className="btn-primary w-full justify-center">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Importando... isso pode levar alguns minutos
        </>
      ) : (
        `Importar ${count} produto${count === 1 ? "" : "s"}`
      )}
    </button>
  );
}
