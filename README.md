# OverBerry — Loja (MVP)

PDP (landing de tráfego pago) + Carrinho do Açaí Liofilizado em Pó 100g.
Next.js (App Router) + TypeScript + Tailwind, mobile-first.

## Tipografia

Fraunces (títulos) + Inter (corpo), **otimizadas via `next/font/google`**.

Importante, para não haver mal-entendido: isto **não é 100% offline no build**.
No build, o Next baixa as fontes do Google Fonts e as embute no projeto — em
produção elas são servidas do seu próprio domínio (sem chamada externa em runtime),
mas **o build precisa de internet** para buscá-las. Se quiser eliminar essa
dependência de rede no build, veja "Migrar para fontes locais" mais abaixo.

## Rodar localmente

Requisitos: Node.js 18.17+ (recomendado 20+) e acesso à internet no build
(para o `next/font/google` baixar Fraunces e Inter).

```bash
npm install
npm run dev      # http://localhost:3000
```

PDP em `/` · Carrinho em `/carrinho`.

Produção:

```bash
npm run build
npm start
```

## Estrutura

```
app/                layout (fontes, metadata), globals, page (PDP), carrinho/page
components/layout/  Header (logo + botão carrinho), CartCount, Footer
components/ui/       Button, Section, Badge, Accordion, Icon, PlaceholderImage
components/pdp/       seções da PDP
components/cart/      CartDrawer, CartLineItem, QuantityStepper, EmptyCart
lib/                content.ts, cart.ts (store), shipping.ts (frete), ui.ts (drawer), format.ts
public/             embalagem.jpg, logo.png
```

## Editar conteúdo e regras

- Preços e copy do produto: `lib/content.ts`.
- Política de frete: `lib/shipping.ts` (taxas por região + frete grátis acima de R$179,90).

## Estado atual

- PDP completa (14 seções).
- Carrinho: página `/carrinho` + drawer global, lista de itens, alterar quantidade,
  remover, subtotal, frete fixo por região, total, estado vazio, persistência em localStorage.
- "Finalizar compra" é stub (sem Mercado Pago). Sem Supabase, sem webhook, sem /obrigado.

## Migrar para fontes locais (opcional, elimina a dependência de rede no build)

Quando quiser tornar o build 100% offline, troque `next/font/google` por
`next/font/local`. Passo a passo:

1. Baixe os `.woff2` oficiais (ambas as fontes são licença SIL OFL, livres para
   redistribuir). Fontes recomendadas:
   - google-webfonts-helper (`gwfh.mranftl.com`): escolha a família, marque os
     pesos e baixe o `woff2`; ou
   - Fontsource (`fontsource.org`) / pacotes npm `@fontsource/fraunces` e
     `@fontsource/inter`.
2. Pesos usados neste projeto:
   - Fraunces: 500 e 600
   - Inter: 400, 500 e 600
3. Coloque os arquivos em `app/fonts/`, por exemplo:
   `app/fonts/Fraunces-Medium.woff2`, `Fraunces-SemiBold.woff2`,
   `Inter-Regular.woff2`, `Inter-Medium.woff2`, `Inter-SemiBold.woff2`.
4. Em `app/layout.tsx`, substitua o import por:

```ts
import localFont from "next/font/local";

const fraunces = localFont({
  src: [
    { path: "./fonts/Fraunces-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Fraunces-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});
```

As variáveis CSS (`--font-display`, `--font-body`) e o resto do código continuam iguais.

## Próxima fase

Checkout Mercado Pago (redirect + Pix) → /obrigado → tracking → Supabase/webhook.
