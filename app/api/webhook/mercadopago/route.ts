// Webhook Mercado Pago — atualiza o status REAL do pedido no Supabase.
//
// Princípios de segurança:
// 1. NUNCA confiar no body da notificação: só extraímos o payment_id e
//    consultamos GET /v1/payments/{id} na API do Mercado Pago com nosso token.
// 2. Assinatura (header x-signature) validada com MERCADO_PAGO_WEBHOOK_SECRET
//    via HMAC-SHA256 (manifest id:...;request-id:...;ts:...;) e timingSafeEqual.
//    - Produção: secret obrigatório; sem ele, 401 + log de erro.
//    - Desenvolvimento: secret vazio processa com WARNING claro no console.
// 3. Sempre responder 2xx para eventos irrelevantes/desconhecidos — o MP
//    reenvia em caso de erro e não queremos tempestade de retries.

import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { updateOrderByReference } from "@/lib/supabase";

const MP_PAYMENT_URL = "https://api.mercadopago.com/v1/payments";

function verifySignature(request: Request, dataId: string): boolean | "dev-skip" {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[webhook] MERCADO_PAGO_WEBHOOK_SECRET ausente em PRODUÇÃO. Notificação rejeitada. " +
          "Configure o secret no painel do Mercado Pago e nas variáveis de ambiente."
      );
      return false;
    }
    console.warn(
      "[webhook] AVISO: MERCADO_PAGO_WEBHOOK_SECRET vazio — validação de assinatura PULADA " +
        "(permitido apenas em desenvolvimento). Configure antes de ir para produção."
    );
    return "dev-skip";
  }

  const signature = request.headers.get("x-signature") ?? "";
  const requestId = request.headers.get("x-request-id") ?? "";

  // x-signature: "ts=1704908010,v1=abcdef..."
  const parts = Object.fromEntries(
    signature.split(",").map((p) => p.trim().split("=") as [string, string])
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  // Manifest oficial do Mercado Pago (data.id alfanumérico em minúsculas)
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false; // comprimentos diferentes / hex inválido
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);

  // O MP envia o id na query (?data.id=... ou ?id=...) e/ou no body ({ data: { id } })
  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await request.json();
  } catch {
    // body vazio é aceitável em alguns formatos de notificação
  }

  const topic = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? body.type ?? "";
  const dataId =
    url.searchParams.get("data.id") ??
    url.searchParams.get("id") ??
    (body.data?.id != null ? String(body.data.id) : "");

  // Só processamos notificações de pagamento; o resto confirma recebimento e sai.
  if (!topic.includes("payment") || !dataId) {
    return NextResponse.json({ received: true });
  }

  const sig = verifySignature(request, dataId);
  if (sig === false) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    console.error("[webhook] MERCADO_PAGO_ACCESS_TOKEN ausente.");
    // 500 para o MP reenviar quando o ambiente estiver corrigido
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  // Fonte de verdade: consulta o pagamento na API do Mercado Pago.
  let payment: {
    id?: number | string;
    status?: string;
    status_detail?: string;
    payment_method_id?: string;
    payment_type_id?: string;
    external_reference?: string;
    payer?: { email?: string };
  };
  try {
    const res = await fetch(`${MP_PAYMENT_URL}/${dataId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[webhook] Falha ao consultar pagamento:", dataId, res.status);
      // 404 do MP: pagamento inexistente — 200 para não gerar retries infinitos.
      // Outros erros: 500 para o MP reenviar.
      return res.status === 404
        ? NextResponse.json({ received: true })
        : NextResponse.json({ error: "mp" }, { status: 500 });
    }
    payment = await res.json();
  } catch (err) {
    console.error("[webhook] Erro de rede ao consultar pagamento:", err);
    return NextResponse.json({ error: "network" }, { status: 500 });
  }

  const externalReference = payment.external_reference;
  if (!externalReference) {
    console.warn("[webhook] Pagamento sem external_reference:", dataId);
    return NextResponse.json({ received: true });
  }

  const updated = await updateOrderByReference(externalReference, {
    mercado_pago_payment_id: String(payment.id ?? dataId),
    status: payment.status ?? "unknown",
    status_detail: payment.status_detail ?? null,
    payment_method_id: payment.payment_method_id ?? null,
    payment_type_id: payment.payment_type_id ?? null,
    payer_email: payment.payer?.email ?? null,
    raw_payment: payment,
  });

  if (updated === 0) {
    // Pedido não encontrado: loga e responde 200 (evita retry storm; conciliar manualmente).
    console.warn("[webhook] Nenhum pedido com external_reference:", externalReference);
  }

  return NextResponse.json({ received: true });
}
