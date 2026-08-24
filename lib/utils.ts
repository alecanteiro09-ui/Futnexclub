import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Sanitiza nome de personalização: sem espaços duplicados, limite de caracteres, uppercase visual no preview */
export function sanitizeCustomName(input: string, maxChars = 12): string {
  return input.replace(/\s+/g, " ").trim().slice(0, maxChars);
}

/** Valida número de personalização (1–99) */
export function isValidCustomNumber(value: string, min = 1, max = 99): boolean {
  if (value === "") return true; // opcional até o momento do pedido
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max;
}
