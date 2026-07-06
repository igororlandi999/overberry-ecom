// Cliente Supabase server-side minimalista (PostgREST via fetch, sem SDK).
// SUPABASE_SERVICE_ROLE_KEY existe SOMENTE no servidor — nunca importar em client component.
// A service role bypassa RLS; a tabela orders fica fechada para o mundo.

type OrderInsert = {
  external_reference: string;
  preference_id: string | null;
  status: string;
  region: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: unknown; // jsonb
};

type OrderPaymentUpdate = {
  mercado_pago_payment_id: string;
  status: string;
  status_detail: string | null;
  payment_method_id: string | null;
  payment_type_id: string | null;
  payer_email: string | null;
  raw_payment: unknown; // jsonb
};

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function rest(path: string, init: RequestInit): Promise<Response | null> {
  const cfg = env();
  if (!cfg) {
    console.error("[supabase] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes.");
    return null;
  }
  return fetch(`${cfg.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}

/** Insere o pedido na criação da preferência. Retorna true em sucesso. */
export async function insertOrder(order: OrderInsert): Promise<boolean> {
  const res = await rest("orders", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(order),
  });
  if (!res) return false;
  if (!res.ok) {
    console.error("[supabase] Falha ao inserir pedido:", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

/** Atualiza o pedido pelo external_reference (chamado pelo webhook). Retorna nº de linhas afetadas. */
export async function updateOrderByReference(
  externalReference: string,
  update: OrderPaymentUpdate
): Promise<number> {
  const res = await rest(`orders?external_reference=eq.${encodeURIComponent(externalReference)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(update),
  });
  if (!res) return 0;
  if (!res.ok) {
    console.error("[supabase] Falha ao atualizar pedido:", res.status, await res.text().catch(() => ""));
    return 0;
  }
  const rows = (await res.json().catch(() => [])) as unknown[];
  return Array.isArray(rows) ? rows.length : 0;
}
