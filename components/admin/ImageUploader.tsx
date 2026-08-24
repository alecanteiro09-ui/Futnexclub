"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  bucket: "teams" | "products" | "collections" | "banners";
  pathPrefix: string; // ex: `teams/${teamId}` — organiza por id, nunca por nome manual (seção 10)
  value: string[]; // URLs já salvas
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
}

/**
 * Upload de imagens direto do computador (seção 63). O upload roda no browser
 * usando a sessão do usuário logado — as policies de Storage (is_admin()) garantem
 * que só administradores conseguem escrever nos buckets.
 */
export function ImageUploader({ bucket, pathPrefix, value, onChange, multiple = false, label = "Adicionar imagem" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      onChange(multiple ? [...value, ...uploadedUrls] : uploadedUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload. Confira se você está logado como admin.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      {label && <p className="mb-2 text-sm font-medium text-ink-muted">{label}</p>}

      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-base-border bg-base">
              <Image src={url} alt={`Imagem ${i + 1}`} fill className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {i > 0 && (
                  <button type="button" onClick={() => moveImage(i, -1)} className="rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20">
                    ←
                  </button>
                )}
                <button type="button" onClick={() => removeImage(url)} className="rounded-md bg-red-500/80 p-1.5 text-white hover:bg-red-500">
                  <X className="h-3.5 w-3.5" />
                </button>
                {i < value.length - 1 && (
                  <button type="button" onClick={() => moveImage(i, 1)} className="rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20">
                    →
                  </button>
                )}
              </div>
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-base-border px-4 py-4 text-sm font-semibold text-ink-muted transition-colors hover:border-accent/50 hover:text-ink disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Enviando..." : "Upload do computador"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <p className="mt-2 text-xs text-ink-muted">PNG, JPG ou WEBP. Recomendado 1080x1350.</p>
    </div>
  );
}
