// Tipos compartilhados do checkout + helper client-side.
// O client envia APENAS sku/qty/regiao. Precos sao reconstruidos no servidor.

import type { RegionKey } from "@/lib/shipping";

export type CheckoutItemInput = { sku: string; qty: number };

export type CheckoutRequest = {
  items: CheckoutItemInput[];
  region: RegionKey | null;
};

export type CheckoutResponse =
  | { ok: true; init_point: string }
  | { ok: false; error: string };

/** Chama a API de checkout e devolve a URL do Mercado Pago (init_point). */
export async function startCheckout(req: CheckoutRequest): Promise<CheckoutResponse> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    const data = (await res.json()) as CheckoutResponse;
    if (!res.ok || !data.ok) {
      return { ok: false, error: (!data.ok && data.error) || "Não foi possível iniciar o pagamento." };
    }
    return data;
  } catch {
    return { ok: false, error: "Falha de conexão. Tente novamente." };
  }
}
