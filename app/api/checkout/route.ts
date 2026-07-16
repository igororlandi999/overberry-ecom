// Checkout Mercado Pago (Checkout Pro) — cria a preferência no servidor.
//
// Segurança:
// - MERCADO_PAGO_ACCESS_TOKEN e MELHOR_ENVIO_TOKEN existem SOMENTE aqui (server).
// - Nenhum preço vindo do client é usado: itens são reconstruídos de lib/content.ts
//   e o frete é RECOTADO no Melhor Envio pelo CEP + serviço escolhido.
// - Frete grátis: subtotal >= FREE_SHIPPING_THRESHOLD cobra R$ 0,00 do cliente,
//   mas o custo real da etiqueta fica registrado em shipping_quote (Supabase).

import { NextResponse } from "next/server";
import { offers, product } from "@/lib/content";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { quoteShipping, sanitizeZip } from "@/lib/melhorenvio";
import type { CheckoutRequest } from "@/lib/checkout";
import { insertOrder } from "@/lib/supabase";
import { randomUUID } from "node:crypto";

const MAX_QTY = 99;

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

const QUOTE_FAIL_MESSAGE =
  "Não conseguimos calcular o frete agora. Tente novamente em instantes ou fale com a OverBerry para finalizar seu pedido.";

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
  const validated: { sku: string; title: string; qty: number; unitPrice: number; units: number }[] = [];

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
      units: offer.units * qty,
    });
  }

  const subtotal = validated.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const totalUnits = validated.reduce((sum, i) => sum + i.units, 0);

  // --- Frete: recotação no servidor (o client informa apenas CEP + serviço) ---
  const zip = sanitizeZip(body.shippingZip ?? "");
  if (!zip) return bad("Informe um CEP válido para o frete.");

  if (typeof body.shippingServiceId !== "string" || body.shippingServiceId.length === 0) {
    return bad("Escolha uma opção de frete.");
  }

  const options = await quoteShipping({ toZip: zip, units: totalUnits, insuranceValue: subtotal });
  if (!options) {
    return bad(QUOTE_FAIL_MESSAGE, 502);
  }

  const option = options.find((o) => o.serviceId === body.shippingServiceId);
  if (!option) {
    return bad("A opção de frete escolhida não está mais disponível. Recalcule o frete e tente de novo.");
  }

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : option.price; // cobrado do cliente
  // option.price = custo real da etiqueta, sempre registrado em shipping_quote.

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
    items.push({
      id: "frete",
      title: `Frete — ${option.carrier} ${option.service}`,
      quantity: 1,
      currency_id: "BRL",
      unit_price: shipping,
    });
  }

  const externalReference = `ob-${randomUUID()}`; // conciliado pelo webhook

  const preference = {
    items,
    back_urls: {
      success: `${siteUrl}/obrigado`,
      pending: `${siteUrl}/pagamento-pendente`,
      failure: `${siteUrl}/pagamento-falhou`,
    },
    // auto_return e notification_url exigem URL https pública; em localhost o MP rejeita.
    ...(siteUrl.startsWith("https")
      ? {
          auto_return: "approved",
          notification_url: `${siteUrl}/api/webhook/mercadopago`,
        }
      : {}),
    statement_descriptor: "OVERBERRY",
    external_reference: externalReference,
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

    const data = (await res.json()) as { init_point?: string; id?: string };
    if (!data.init_point) {
      console.error("[checkout] Resposta sem init_point:", data);
      return bad("Não foi possível iniciar o pagamento. Tente novamente.", 502);
    }

    // Registra o pedido (status "created"). O webhook atualiza o status real depois.
    // Falha aqui NÃO bloqueia a venda: loga alto e segue — conciliação manual é possível
    // pelo painel do Mercado Pago via external_reference.
    const saved = await insertOrder({
      external_reference: externalReference,
      preference_id: data.id ?? null,
      status: "created",
      region: "melhor-envio", // compatibilidade com a coluna legada
      subtotal,
      shipping,
      total: subtotal + shipping,
      items: validated.map((i) => ({ sku: i.sku, title: i.title, qty: i.qty, unit_price: i.unitPrice })),
      shipping_zip: zip,
      shipping_carrier: option.carrier,
      shipping_service: option.service,
      shipping_service_id: option.serviceId,
      shipping_deadline: option.deadline,
      shipping_quote: {
        real_price: option.price,       // custo real da etiqueta (Melhor Envio)
        charged_price: shipping,        // valor cobrado do cliente (0 se frete grátis)
        free_shipping: freeShipping,
        package_units: totalUnits,
        option,
        quoted_at: new Date().toISOString(),
      },
    });
    if (!saved) {
      console.error("[checkout] Pedido NÃO registrado no Supabase:", externalReference);
    }

    return NextResponse.json({ ok: true, init_point: data.init_point });
  } catch (err) {
    console.error("[checkout] Falha ao chamar Mercado Pago:", err);
    return bad("Não foi possível iniciar o pagamento. Tente novamente.", 502);
  }
}
