import { parseCsv } from "@/lib/import/csv";
import { slugify } from "@/lib/utils";
import { ProductCategory, SizeLabel } from "@/types";

const ALL_SIZES: SizeLabel[] = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

export interface ImportImage {
  url: string;
  position: number;
  alt?: string;
}

export interface ImportRowIssue {
  level: "error" | "warning";
  message: string;
}

export interface ParsedProductGroup {
  key: string;
  title: string;
  teamName: string;
  season: string | null;
  category: ProductCategory;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  sizes: SizeLabel[];
  images: ImportImage[];
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  allowCustomName: boolean;
  allowCustomNumber: boolean;
  maxNameCharacters: number;
  minNumber: number;
  maxNumber: number;
  issues: ImportRowIssue[];
}

export interface ParseResult {
  groups: ParsedProductGroup[];
  totalRows: number;
  fatalError?: string;
}

export function hasBlockingIssues(g: ParsedProductGroup): boolean {
  return g.issues.some((i) => i.level === "error");
}

// Aceita cabeçalhos em português, inglês e o formato de exportação da Shopify.
const FIELD_ALIASES: Record<string, string[]> = {
  handle: ["handle"],
  title: ["title", "titulo", "nome", "nomedoproduto", "name", "productname"],
  team: ["team", "vendor", "time", "club", "clube"],
  season: ["season", "temporada", "ano", "year"],
  category: ["category", "categoria", "type", "tipo", "producttype"],
  description: ["bodyhtml", "body", "description", "descricao", "descricaocomercial"],
  price: ["price", "variantprice", "preco"],
  compareAtPrice: ["compareatprice", "variantcompareatprice", "precode", "precocomparativo", "precoantigo"],
  sizes: ["sizes", "tamanhos", "tamanho"],
  option1Name: ["option1name"],
  option1Value: ["option1value"],
  imageSrc: ["imagesrc", "imageurl", "imagem", "imagemurl"],
  images: ["images", "imagens", "imagensurls", "urlsdeimagens"],
  imagePosition: ["imageposition", "posicaoimagem", "ordemimagem"],
  imageAlt: ["imagealttext", "imagealt", "textoalternativo", "alt"],
  published: ["published", "status", "ativo"],
  featured: ["featured", "destaque"],
  bestSeller: ["bestseller", "maisvendido"],
  isNew: ["isnew", "new", "lancamento"],
  allowCustomName: ["allowcustomname", "permitirnome"],
  allowCustomNumber: ["allowcustomnumber", "permitirnumero"],
  maxNameChars: ["maxnamecharacters", "maxcaracteresnome"],
  minNumber: ["minnumber", "numerominimo"],
  maxNumber: ["maxnumber", "numeromaximo"],
};

const CATEGORY_MAP: Record<string, ProductCategory> = {
  casa: "casa",
  home: "casa",
  fora: "fora",
  away: "fora",
  alternativa: "alternativa",
  third: "alternativa",
  alternative: "alternativa",
  retro: "retro",
  selecao: "selecao",
  national: "selecao",
  nationalteam: "selecao",
  outro: "outro",
  other: "outro",
};

function normalizeHeader(h: string): string {
  return h
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function buildHeaderMap(headerRow: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headerRow.forEach((h, idx) => {
    const norm = normalizeHeader(h);
    for (const [canonical, aliases] of Object.entries(FIELD_ALIASES)) {
      if (!map.has(canonical) && aliases.includes(norm)) {
        map.set(canonical, idx);
      }
    }
  });
  return map;
}

function parseBool(raw: string | undefined, fallback: boolean): boolean {
  if (raw === undefined || raw === "") return fallback;
  const v = raw.trim().toLowerCase();
  if (["true", "1", "sim", "yes", "active", "ativo", "y", "s"].includes(v)) return true;
  if (["false", "0", "nao", "não", "no", "draft", "inativo", "n"].includes(v)) return false;
  return fallback;
}

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  let v = raw.trim().replace(/^r\$\s*/i, "").replace(/\s/g, "");
  if (v === "") return null;
  if (v.includes(",") && v.includes(".")) {
    v = v.replace(/\./g, "").replace(",", ".");
  } else if (v.includes(",")) {
    v = v.replace(",", ".");
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseProductImportCsv(csvText: string): ParseResult {
  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    return { groups: [], totalRows: 0, fatalError: "Arquivo vazio." };
  }

  const [headerRow, ...dataRows] = rows;
  const headerMap = buildHeaderMap(headerRow);

  if (!headerMap.has("title")) {
    return {
      groups: [],
      totalRows: dataRows.length,
      fatalError: 'Coluna de nome do produto não encontrada (ex: "nome" ou "title"). Confira o cabeçalho do CSV.',
    };
  }

  const groupsByKey = new Map<string, ParsedProductGroup>();
  const order: string[] = [];

  dataRows.forEach((row, i) => {
    if (row.every((c) => c.trim() === "")) return;
    const lineNumber = i + 2;

    const get = (field: string): string | undefined => {
      const idx = headerMap.get(field);
      if (idx === undefined) return undefined;
      const v = row[idx];
      return v === undefined ? undefined : v.trim();
    };

    const handleRaw = get("handle");
    const title = get("title") ?? "";
    const key = handleRaw || (title ? slugify(title) : `linha-${lineNumber}`);

    let group = groupsByKey.get(key);
    if (!group) {
      group = {
        key,
        title: "",
        teamName: "",
        season: null,
        category: "outro",
        description: null,
        price: 149.9,
        compareAtPrice: null,
        sizes: [],
        images: [],
        isActive: true,
        isFeatured: false,
        isBestSeller: false,
        isNew: false,
        allowCustomName: true,
        allowCustomNumber: true,
        maxNameCharacters: 12,
        minNumber: 1,
        maxNumber: 99,
        issues: [],
      };
      groupsByKey.set(key, group);
      order.push(key);
    }

    if (title) {
      group.title = title;
      const team = get("team");
      if (team) group.teamName = team;
      const season = get("season");
      if (season) group.season = season;

      const category = get("category");
      if (category) {
        const normCat = normalizeHeader(category);
        const mapped = CATEGORY_MAP[normCat];
        group.category = mapped ?? "outro";
        if (!mapped) {
          group.issues.push({ level: "warning", message: `Categoria "${category}" não reconhecida na linha ${lineNumber}, usando "outro".` });
        }
      }

      const description = get("description");
      if (description) group.description = description;

      const priceRaw = get("price");
      if (priceRaw) {
        const parsed = parsePrice(priceRaw);
        if (parsed === null) {
          group.issues.push({ level: "warning", message: `Preço inválido "${priceRaw}" na linha ${lineNumber}, usando padrão R$149,90.` });
        } else {
          group.price = parsed;
        }
      }

      const compareRaw = get("compareAtPrice");
      if (compareRaw) {
        const parsed = parsePrice(compareRaw);
        if (parsed === null) {
          group.issues.push({ level: "warning", message: `Preço "de" inválido "${compareRaw}" na linha ${lineNumber}, ignorado.` });
        } else {
          group.compareAtPrice = parsed;
        }
      }

      group.isActive = parseBool(get("published"), true);
      group.isFeatured = parseBool(get("featured"), false);
      group.isBestSeller = parseBool(get("bestSeller"), false);
      group.isNew = parseBool(get("isNew"), false);
      group.allowCustomName = parseBool(get("allowCustomName"), true);
      group.allowCustomNumber = parseBool(get("allowCustomNumber"), true);

      const maxNameChars = get("maxNameChars");
      if (maxNameChars) group.maxNameCharacters = Number(maxNameChars) || 12;
      const minNumber = get("minNumber");
      if (minNumber) group.minNumber = Number(minNumber) || 1;
      const maxNumber = get("maxNumber");
      if (maxNumber) group.maxNumber = Number(maxNumber) || 99;
    }

    const sizesRaw = get("sizes");
    if (sizesRaw) {
      sizesRaw
        .split(/[|,;]/)
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .forEach((s) => {
          if ((ALL_SIZES as string[]).includes(s)) {
            if (!group!.sizes.includes(s as SizeLabel)) group!.sizes.push(s as SizeLabel);
          } else {
            group!.issues.push({ level: "warning", message: `Tamanho "${s}" não reconhecido na linha ${lineNumber} (use PP, P, M, G, GG, XG ou XXG).` });
          }
        });
    }

    const opt1Name = get("option1Name");
    const opt1Value = get("option1Value");
    if (opt1Value && (!opt1Name || /tamanho|size/i.test(opt1Name))) {
      const s = opt1Value.toUpperCase();
      if ((ALL_SIZES as string[]).includes(s)) {
        if (!group.sizes.includes(s as SizeLabel)) group.sizes.push(s as SizeLabel);
      } else {
        group.issues.push({ level: "warning", message: `Tamanho "${s}" não reconhecido na linha ${lineNumber} (use PP, P, M, G, GG, XG ou XXG).` });
      }
    }

    const imageSrc = get("imageSrc");
    if (imageSrc) {
      const imagePositionRaw = get("imagePosition");
      const position = imagePositionRaw ? Number(imagePositionRaw) || group.images.length + 1 : group.images.length + 1;
      group.images.push({ url: imageSrc, position, alt: get("imageAlt") });
    }

    const imagesMulti = get("images");
    if (imagesMulti) {
      imagesMulti
        .split("|")
        .map((u) => u.trim())
        .filter(Boolean)
        .forEach((u) => {
          group!.images.push({ url: u, position: group!.images.length + 1 });
        });
    }

    group.key = group.key; // no-op, mantém referência
  });

  const groups = order.map((k) => groupsByKey.get(k)!);

  for (const g of groups) {
    const seen = new Set<string>();
    g.images = g.images
      .filter((img) => {
        if (seen.has(img.url)) return false;
        seen.add(img.url);
        return true;
      })
      .sort((a, b) => a.position - b.position);

    if (!g.title) g.issues.unshift({ level: "error", message: "Produto sem nome/título — linha ignorada." });
    if (!g.teamName) g.issues.unshift({ level: "error", message: `Time não informado para "${g.title || g.key}".` });
    if (g.images.length === 0) g.issues.push({ level: "warning", message: `Nenhuma imagem informada para "${g.title || g.key}".` });
  }

  return { groups, totalRows: dataRows.length };
}
