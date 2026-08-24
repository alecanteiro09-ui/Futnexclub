# Futnex Club

Catálogo digital premium de camisas de futebol modelo torcedor, com personalização de
nome e número. O fluxo central da aplicação é:

```
Anúncio → Catálogo → Time → Modelo → Personalização → Tamanho → Kit (1/2/3) → WhatsApp
```

O WhatsApp é o canal de fechamento da venda — não há checkout tradicional como fluxo
principal (ver seções 1 e 53 do briefing original do projeto).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design system dark/sports premium próprio, ver `tailwind.config.ts`)
- **Supabase** (Postgres + Auth + Storage) para dados, autenticação do admin e imagens
- **Lucide Icons**

## Estrutura do projeto

```
/app                    rotas (App Router)
  /admin                 painel administrativo (protegido por Supabase Auth)
  /catalogo, /times/[slug], /produto/[slug], /colecoes/[slug], /pedido, /busca, ...
/components
  /catalog                cards de produto e time, seção de oferta (kit 1/2/3)
  /product                galeria, personalização com preview, seletor de tamanho
  /whatsapp                botão de CTA e captura de UTM
  /cart                    contexto do "kit" (até 3 camisas), persistido em localStorage
  /layout                  header/footer
  /ui                      placeholders de imagem (nunca mostrar imagem quebrada)
/lib
  /supabase                clientes browser/server/admin
  data.ts                  queries de leitura (times, produtos, coleções)
  pricing.ts                preços centralizados do kit (1/2/3 camisas)
  whatsapp.ts               montagem da mensagem estruturada do pedido
  utils.ts                   slugify, sanitização de nome/número
/types                    tipos que espelham o schema do Supabase
/supabase
  /migrations/0001_init.sql  schema completo + RLS + buckets de Storage
  seed.sql                   times (Brasil, Europa, Seleções), tamanhos, coleções
```

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha as variáveis (ver abaixo)
npm run dev
```

O site funciona mesmo sem o Supabase configurado (mostra estados vazios em vez de
quebrar), mas para ver times/produtos reais você precisa conectar um projeto Supabase.

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode o conteúdo de `supabase/migrations/0001_init.sql` — isso cria
   todas as tabelas, índices, políticas de RLS e os buckets de Storage (`teams`,
   `products`, `collections`, `banners`).
3. Rode em seguida `supabase/seed.sql` — popula os 20 clubes da Série A 2026, os
   principais clubes europeus, seleções, tamanhos (PP–XXG) e coleções padrão. Um único
   produto DEMO do Flamengo é criado, claramente marcado com `is_demo = true`.
4. Em **Project Settings → API**, copie a `URL`, a `anon public key` e a
   `service_role key` para o seu `.env.local`.
5. Para o painel `/admin` funcionar, crie um usuário em **Authentication → Users** e
   depois insira o `id` desse usuário na tabela `admin_users`:
   ```sql
   insert into admin_users (id, full_name) values ('<uuid-do-usuário>', 'Seu Nome');
   ```

## Variáveis de ambiente

Ver `.env.example`. Nunca coloque a `SUPABASE_SERVICE_ROLE_KEY` em código que roda no
browser — ela só é usada em `lib/supabase/server.ts` (`createAdminClient`), em Route
Handlers/Server Actions do admin.

## WhatsApp

O número da loja vem de `NEXT_PUBLIC_WHATSAPP_NUMBER` (formato E.164 sem `+`, ex:
`5511999999999`). A mensagem enviada é montada em `lib/whatsapp.ts` a partir dos itens
do kit — nunca hardcoded em componentes. Parâmetros UTM da URL de entrada (`utm_source`,
`utm_campaign`, etc.) são preservados na sessão e anexados à mensagem quando disponíveis.

## Deploy na Vercel

```bash
git init
git add .
git commit -m "futnex club: scaffold inicial"
git push
```

Depois, importe o repositório na Vercel e configure as mesmas variáveis de ambiente do
`.env.example` no painel do projeto (Settings → Environment Variables). O
`next.config.mjs` já libera imagens remotas de `*.supabase.co/storage/v1/object/public`.

## Roadmap (fases ainda não implementadas nesta entrega)

Esta entrega cobre as **Fases 1–3 e a base das Fases 5–10** do plano original
(setup, design system, home, navegação, schema + seed do banco, catálogo, página de
produto, personalização com preview, kit 1/2/3, CTA de WhatsApp, SEO básico). Ficam
para a próxima iteração:

- **Admin completo (Fase 11):** formulários de criação/edição de produtos e times com
  upload múltiplo de imagens para o Supabase Storage (drag-and-drop, reordenação,
  definição de imagem principal), CRUD de coleções/banners/ofertas/configurações.
- **Autenticação real do admin** ligada à UI (a proteção de rota já existe em
  `app/admin/layout.tsx`, faltando o fluxo de convite/gestão de usuários).
- **Analytics (Fase 12):** conectar a camada de eventos já preparada (`trackEvent` em
  `WhatsAppButton.tsx`) a um provedor real (GA4, Meta Pixel, TikTok Pixel).
- **Otimização de imagens/performance (Fase 14):** paginação "carregar mais" no
  catálogo quando o volume de produtos crescer.
- **Registro de pedidos (seção 61):** hoje o clique em WhatsApp abre a conversa; falta
  persistir o registro em `orders`/`order_items` via Route Handler no momento do clique.

## Regras que o código já aplica

- Nenhuma imagem, produto ou preço fica hardcoded — tudo vem do Supabase, com
  placeholders elegantes (`components/ui/Placeholders.tsx`) enquanto não há dados.
- Preços do kit centralizados em `lib/pricing.ts`.
- Número de WhatsApp centralizado em `lib/whatsapp.ts`, lido de variável de ambiente.
- RLS: visitantes só leem dados ativos; apenas usuários em `admin_users` podem
  escrever.
- Produto nunca é descrito como oficial/licenciado a menos que isso seja cadastrado
  explicitamente na descrição comercial do produto.
