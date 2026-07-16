// Politica de frete do MVP. Frete fixo por regiao.
// Frete gratis para pedidos a partir do limite (foco em kits).

export const FREE_SHIPPING_THRESHOLD = 169.9;

export type RegionKey = "sudeste" | "sul" | "centro-oeste" | "norte-nordeste";

export const regions: { key: RegionKey; label: string; rate: number }[] = [
  { key: "sudeste", label: "Sudeste", rate: 14.9 },
  { key: "sul", label: "Sul", rate: 18.9 },
  { key: "centro-oeste", label: "Centro-Oeste", rate: 22.9 },
  { key: "norte-nordeste", label: "Norte / Nordeste", rate: 27.9 },
];

export function rateFor(region: RegionKey): number {
  return regions.find((r) => r.key === region)?.rate ?? 0;
}

// Retorna o frete final: 0 (gratis) se atingiu o limite, senao a taxa da regiao.
export function shippingFor(region: RegionKey | null, subtotal: number): number | null {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  if (!region) return null; // ainda nao escolheu a regiao
  return rateFor(region);
}

export function isFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

export function missingForFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}
