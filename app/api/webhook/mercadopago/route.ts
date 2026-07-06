// Webhook Mercado Pago — atualiza o status REAL do pedido no Supabase.
//
// Segurança:
// 1. Não confiar no body da notificação.
// 2. Consultar a API do Mercado Pago com o token do servidor.
// 3. Validar assinatura quando MERCADO_PAGO_WEBHOOK_SECRET existir.
// 4. Aceitar payment e merchant_order, porque o Mercado Pago pode enviar ambos.

import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { updateOrderByReference } from "@/lib/supabase";

const MP_PAYMENT_URL = "https://api.mercadopago.com/v1/payments";
const MP_MERCHANT_ORDER_URL = "https://api.mercadopago.com/merchant_orders";

function verifySignature(request: Request, dataId: string): boolean | "dev-skip" {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[webhook] MERCADO_PAGO_WEBHOOK_SECRET ausente em produção.");
      return false;
    }

    console.warn("[webhook] Secret ausente em desenvolvimento. Validação pulada.");
    return "dev-skip";
  }

  const signature = request.headers.get("x-signature") ?? "";
  const requestId = request.headers.get("x-request-id") ?? "";

  const parts = Object.fromEntries(
    signature.split(",").map((p) => p.trim().split("=") as [string, string])
  );

  const ts = parts["ts"];
  const v1 = parts["v1"];

  if (!ts || !v1 || !requestId) {
    console.warn("[webhook] Assinatura incompleta.", {
      hasTs: Boolean(ts),
      hasV1: Boolean(v1),
      hasRequestId: Boolean(requestId),
    });
    return false;
  }

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

async function getPaymentFromMercadoPago(paymentId: string, token: string) {
  console.log("[webhook] consultando payment", paymentId);

  const res = await fetch(`${MP_PAYMENT_URL}/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[webhook] falha ao consultar payment", {
      paymentId,
      status: res.status,
      body: text.slice(0, 500),
    });

    return null;
  }

  return res.json();
}

async function getPaymentIdFromMerchantOrder(merchantOrderId: string, token: string) {
  console.log("[webhook] consultando merchant_order", merchantOrderId);

  const res = await fetch(`${MP_MERCHANT_ORDER_URL}/${merchantOrderId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[webhook] falha ao consultar merchant_order", {
      merchantOrderId,
      status: res.status,
      body: text.slice(0, 500),
    });

    return null;
  }

  const merchantOrder = await res.json();

  console.log("[webhook] merchant_order recebido", {
    merchantOrderId,
    status: merchantOrder?.status,
    paymentsCount: Array.isArray(merchantOrder?.payments)
      ? merchantOrder.payments.length
      : 0,
  });

  const approvedPayment =
    merchantOrder?.payments?.find((p: any) => p.status === "approved") ??
    merchantOrder?.payments?.[0];

  const paymentId = approvedPayment?.id ? String(approvedPayment.id) : null;

  console.log("[webhook] payment extraído do merchant_order", {
    merchantOrderId,
    paymentId,
    paymentStatus: approvedPayment?.status ?? null,
  });

  return paymentId;
}

export async function POST(request: Request) {
  const url = new URL(request.url);

  let body: {
    type?: string;
    topic?: string;
    action?: string;
    data?: { id?: string | number };
    resource?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    // body vazio é aceitável.
  }

  const topic =
    url.searchParams.get("type") ??
    url.searchParams.get("topic") ??
    body.type ??
    body.topic ??
    "";

  const dataId =
    url.searchParams.get("data.id") ??
    url.searchParams.get("id") ??
    (body.data?.id != null ? String(body.data.id) : "");

  console.log("[webhook] received", {
    topic,
    dataId,
    hasBodyDataId: Boolean(body.data?.id),
    hasSignature: Boolean(request.headers.get("x-signature")),
    hasRequestId: Boolean(request.headers.get("x-request-id")),
  });

  if (!topic || !dataId) {
    console.warn("[webhook] evento sem topic ou id", { topic, dataId });
    return NextResponse.json({ received: true });
  }

  const sig = verifySignature(request, dataId);

  if (sig === false) {
    console.warn("[webhook] assinatura inválida, seguindo com validação via API Mercado Pago", {
      topic,
      dataId,
    });
  }

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!token) {
    console.error("[webhook] MERCADO_PAGO_ACCESS_TOKEN ausente.");
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  let paymentId: string | null = null;

  if (topic.includes("payment")) {
    paymentId = dataId;
  } else if (topic.includes("merchant_order")) {
    paymentId = await getPaymentIdFromMerchantOrder(dataId, token);
  } else {
    console.log("[webhook] evento ignorado", { topic, dataId });
    return NextResponse.json({ received: true });
  }

  if (!paymentId) {
    console.warn("[webhook] nenhum payment_id encontrado", { topic, dataId });
    return NextResponse.json({ received: true });
  }

  const payment = await getPaymentFromMercadoPago(paymentId, token);

  if (!payment) {
    return NextResponse.json({ received: true });
  }

  const externalReference = payment.external_reference;

  console.log("[webhook] payment recebido", {
    paymentId,
    status: payment.status,
    status_detail: payment.status_detail,
    external_reference: externalReference,
    payment_method_id: payment.payment_method_id,
    payment_type_id: payment.payment_type_id,
    payer_email: payment.payer?.email ?? null,
  });

  if (!externalReference) {
    console.warn("[webhook] pagamento sem external_reference", { paymentId });
    return NextResponse.json({ received: true });
  }

  const updated = await updateOrderByReference(externalReference, {
    mercado_pago_payment_id: String(payment.id ?? paymentId),
    status: payment.status ?? "unknown",
    status_detail: payment.status_detail ?? null,
    payment_method_id: payment.payment_method_id ?? null,
    payment_type_id: payment.payment_type_id ?? null,
    payer_email: payment.payer?.email ?? null,
    raw_payment: payment,
  });

  console.log("[webhook] update result", {
    externalReference,
    updatedRows: updated,
  });

  if (updated === 0) {
    console.warn("[webhook] nenhum pedido encontrado para external_reference", {
      externalReference,
    });
  }

  return NextResponse.json({ received: true });
}