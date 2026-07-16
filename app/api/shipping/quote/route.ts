// Cotação de frete por CEP via Melhor Envio.
// O client envia APENAS { zip, items: [{sku, qty}] }.
// Unidades e valor declarado são reconstruídos de lib/content.ts (fonte de verdade).

import { NextResponse } from "next/server";
import { offers } from "@/lib/content";
import { quoteShipping, sanitizeZip } from "@/lib/melhorenvio";

const MAX_QTY = 99;

const QUOTE_FAIL_MESSAGE =
  "Não conseguimos calcular o frete agora. Tente novamente em instantes ou fale com a OverBerry para finalizar seu pedido.";

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

type QuoteRequest = {
  zip?: string;
  items?: { sku?: string; qty?: number }[];
};

export async function POST(request: Request) {
  let body: QuoteRequest;
  try {
    body = (await request.json()) as QuoteRequest;
  } catch {
    return bad("Requisição inválida.");
  }

  const zip = sanitizeZip(body.zip ?? "");
  if (!zip) return bad("Informe um CEP válido (8 dígitos).");

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return bad("Seu carrinho está vazio.");
  }

  // Reconstrói unidades e subtotal a partir do servidor.
  const seen = new Set<string>();
  let units = 0;
  let subtotal = 0;

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

    units += offer.units * qty;
    subtotal += offer.price * qty;
  }

  const options = await quoteShipping({ toZip: zip, units, insuranceValue: subtotal });
  if (!options) {
    return bad(QUOTE_FAIL_MESSAGE, 502);
  }

  return NextResponse.json({ ok: true, zip, options });
}
