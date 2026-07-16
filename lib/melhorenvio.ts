// Cliente Melhor Envio — SERVER ONLY.
// MELHOR_ENVIO_TOKEN existe somente no servidor. Nunca importar em client component.
//
// Endpoint: POST {base}/api/v2/me/shipment/calculate
// Sandbox:  MELHOR_ENVIO_SANDBOX=true aponta para sandbox.melhorenvio.com.br
//           (tokens de sandbox e produção são diferentes; preços do sandbox são fictícios).

export type ShippingOption = {
  serviceId: string; // id do serviço no Melhor Envio (ex.: "1" = Correios PAC)
  carrier: string;   // transportadora (ex.: "Correios", "Jadlog")
  service: string;   // nome do serviço (ex.: "PAC", ".Package")
  price: number;     // preço cotado em BRL (custo real da etiqueta)
  deadline: number;  // prazo estimado em dias úteis
};

export type PackageDims = {
  weight: number; // kg
  length: number; // cm (comprimento)
  width: number;  // cm (largura)
  height: number; // cm (altura)
};

// Dimensões mínimas aceitas (referência Correios). Nunca cotar abaixo disso.
const MIN_LENGTH = 16;
const MIN_WIDTH = 11;
const MIN_HEIGHT = 2;
const MIN_WEIGHT = 0.05;

const QUOTE_TIMEOUT_MS = 10_000;

/** Remove máscara e valida CEP. Retorna 8 dígitos ou null. */
export function sanitizeZip(raw: string): string | null {
  const digits = String(raw).replace(/\D/g, "");
  return /^\d{8}$/.test(digits) ? digits : null;
}

/**
 * Pacote por quantidade total de unidades (pouches de 100g).
 * Medidas provisórias aprovadas até medirmos as caixas reais:
 *   1 un: 0.200 kg — 20 x 15 x 8 cm
 *   2 un: 0.350 kg — 22 x 18 x 10 cm
 *   3 un: 0.500 kg — 24 x 20 x 12 cm
 *   >3:  +0.150 kg e +2 cm de altura por unidade extra (conservador).
 */
export function packageForUnits(units: number): PackageDims {
  const u = Math.max(1, Math.floor(units));
  let dims: PackageDims;
  if (u === 1) dims = { weight: 0.2, length: 20, width: 15, height: 8 };
  else if (u === 2) dims = { weight: 0.35, length: 22, width: 18, height: 10 };
  else if (u === 3) dims = { weight: 0.5, length: 24, width: 20, height: 12 };
  else {
    const extra = u - 3;
    dims = {
      weight: 0.5 + 0.15 * extra,
      length: 24,
      width: 20,
      height: 12 + 2 * extra,
    };
  }
  return {
    weight: Math.max(MIN_WEIGHT, Number(dims.weight.toFixed(3))),
    length: Math.max(MIN_LENGTH, dims.length),
    width: Math.max(MIN_WIDTH, dims.width),
    height: Math.max(MIN_HEIGHT, dims.height),
  };
}

type MelhorEnvioService = {
  id: number | string;
  name?: string;
  price?: string | number;
  custom_price?: string | number;
  delivery_time?: number;
  company?: { name?: string };
  error?: string;
};

function baseUrl(): string {
  return process.env.MELHOR_ENVIO_SANDBOX === "true"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://www.melhorenvio.com.br";
}

/**
 * Cota frete no Melhor Envio. Retorna opções normalizadas (ordenadas por preço)
 * ou null em falha (env ausente, timeout, erro HTTP, resposta inesperada).
 * Quem chama decide a mensagem para o usuário.
 */
export async function quoteShipping(params: {
  toZip: string;          // CEP de destino, 8 dígitos
  units: number;          // total de pouches no pedido
  insuranceValue: number; // valor declarado (subtotal do pedido)
}): Promise<ShippingOption[] | null> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const originZip = sanitizeZip(process.env.MELHOR_ENVIO_ORIGIN_CEP ?? "");
  if (!token || !originZip) {
    console.error("[melhorenvio] MELHOR_ENVIO_TOKEN ou MELHOR_ENVIO_ORIGIN_CEP ausentes/inválidos.");
    return null;
  }

  const toZip = sanitizeZip(params.toZip);
  if (!toZip) return null;

  const pkg = packageForUnits(params.units);

  const body = {
    from: { postal_code: originZip },
    to: { postal_code: toZip },
    package: {
      weight: pkg.weight,
      width: pkg.width,
      height: pkg.height,
      length: pkg.length,
    },
    options: {
      insurance_value: Math.max(0, Number(params.insuranceValue.toFixed(2))),
      receipt: false,
      own_hand: false,
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), QUOTE_TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl()}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        // Exigido pela API do Melhor Envio: identificação do app + contato.
        "User-Agent": "OverBerry (contato@overberry.com.br)",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[melhorenvio] Erro na cotação:", res.status, detail);
      return null;
    }

    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) {
      console.error("[melhorenvio] Resposta inesperada (não é array).");
      return null;
    }

    const options: ShippingOption[] = [];
    for (const raw of data as MelhorEnvioService[]) {
      if (!raw || raw.error) continue; // serviço indisponível para essa rota/pacote
      const price = Number(raw.custom_price ?? raw.price);
      const deadline = Number(raw.delivery_time);
      if (!Number.isFinite(price) || price <= 0) continue;
      if (!Number.isFinite(deadline) || deadline <= 0) continue;
      options.push({
        serviceId: String(raw.id),
        carrier: raw.company?.name?.trim() || "Transportadora",
        service: raw.name?.trim() || "Entrega",
        price: Number(price.toFixed(2)),
        deadline: Math.round(deadline),
      });
    }

    options.sort((a, b) => a.price - b.price);
    return options.length > 0 ? options : null;
  } catch (err) {
    console.error("[melhorenvio] Falha ao cotar frete:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
