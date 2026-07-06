// Checkout Mercado Pago (Checkout Pro) — cria a preferência no servidor.
//
// Segurança:
// - MERCADO_PAGO_ACCESS_TOKEN existe SOMENTE aqui (server). Nunca vai ao client.
// - Nenhum preço vindo do client é usado: tudo é reconstruído de lib/content.ts
//   e o frete é recalculado com lib/shipping.ts.
//
// PRÓXIMA FASE (não implementado aqui de propósito):
// - Webhook de notificação do Mercado Pago para confirmar pagamento de verdade
//   (back_urls indicam intenção, não confirmação) + registro do pedido em banco
//   (Supabase). Até lá, /obrigado significa "pagamento iniciado/aprovado no
//   redirect", não conciliação final.

import { NextResponse } from "next/server";
import { offers, product } from "@/lib/content";
import { regions, shippingFor, type RegionKey } from "@/lib/shipping";
import type { CheckoutRequest } from "@/lib/checkout";

const MAX_QTY = 99;

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    // Log claro no servidor, mensagem genérica para o client.
    console.error("[checkout] MERCADO_PAGO_ACCESS_TOKEN ausente no ambiente.");
    return bad("Pagamento indisponível no momento. Tente novamente em instantes.", 500);
  }

  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return bad("Requisição inválida.");
  }

  // --- Validação de itens (fonte de verdade: lib/content.ts) ---
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return bad("Seu carrinho está vazio.");
  }

  const seen = new Set<string>();
  const validated: { sku: string; title: string; qty: number; unitPrice: number }[] = [];

  for (const raw of body.items) {
    if (!raw || typeof raw.sku !== "string") return bad("Item inválido no carrinho.");
    if (seen.has(raw.sku)) return bad("Item duplicado no carrinho.");
    seen.add(raw.sku);

    const offer = offers.find((o) => o.sku === raw.sku);
    if (!offer) return bad("Produto não reconhecido. Atualize a página e tente de novo.");

    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return bad("Quantidade inválida.");
    }

    validated.push({
      sku: offer.sku,
      title: `${product.name} ${product.weight} — ${offer.label}`,
      qty,
      unitPrice: offer.price, // preço do servidor, nunca do client
    });
  }

  // --- Subtotal e frete recalculados no servidor ---
  const subtotal = validated.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  const region: RegionKey | null =
    body.region && regions.some((r) => r.key === body.region) ? body.region : null;

  const shipping = shippingFor(region, subtotal); // 0 se frete grátis; null se falta região
  if (shipping === null) {
    return bad("Selecione a região de entrega.");
  }

  // --- Monta a preferência ---
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const items = validated.map((i) => ({
    id: i.sku,
    title: i.title,
    quantity: i.qty,
    currency_id: "BRL",
    unit_price: i.unitPrice,
  }));

  if (shipping > 0) {
    const regionLabel = regions.find((r) => r.key === region)?.label ?? "Brasil";
    items.push({
      id: "frete",
      title: `Frete — ${regionLabel}`,
      quantity: 1,
      currency_id: "BRL",
      unit_price: shipping,
    });
  }

  const preference = {
    items,
    back_urls: {
      success: `${siteUrl}/obrigado`,
      pending: `${siteUrl}/pagamento-pendente`,
      failure: `${siteUrl}/pagamento-falhou`,
    },
    // auto_return exige URL https válida; em localhost o MP pode rejeitar.
    ...(siteUrl.startsWith("https") ? { auto_return: "approved" } : {}),
    statement_descriptor: "OVERBERRY",
    external_reference: `ob-${Date.now()}`, // referência simples p/ conciliação futura (webhook)
  };

  try {
    const res = await fetch(MP_PREFERENCES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[checkout] Mercado Pago respondeu erro:", res.status, detail);
      return bad("Não foi possível iniciar o pagamento. Tente novamente.", 502);
    }

    const data = (await res.json()) as { init_point?: string };
    if (!data.init_point) {
      console.error("[checkout] Resposta sem init_point:", data);
      return bad("Não foi possível iniciar o pagamento. Tente novamente.", 502);
    }

    return NextResponse.json({ ok: true, init_point: data.init_point });
  } catch (err) {
    console.error("[checkout] Falha ao chamar Mercado Pago:", err);
    return bad("Não foi possível iniciar o pagamento. Tente novamente.", 502);
  }
}
