"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";
import { isFreeShipping } from "@/lib/shipping";
import type { ShippingOption } from "@/lib/melhorenvio"; // type-only: nada do server vaza ao client
import CartLineItem from "@/components/cart/CartLineItem";
import EmptyCart from "@/components/cart/EmptyCart";
import FreeShippingBar from "@/components/cart/FreeShippingBar";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { startCheckout } from "@/lib/checkout";

/** Máscara visual 00000-000. */
function maskCep(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export default function CartPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());

  const [cep, setCep] = useState("");
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [options, setOptions] = useState<ShippingOption[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const free = isFreeShipping(subtotal);
  const cepDigits = cep.replace(/\D/g, "");
  const cepValid = cepDigits.length === 8;

  // Assinatura do carrinho: se itens/quantidades mudarem, a cotação anterior perde validade.
  const cartSignature = useMemo(
    () => items.map((i) => `${i.sku}:${i.qty}`).join(","),
    [items]
  );
  useEffect(() => {
    setOptions(null);
    setSelectedId(null);
    setQuoteError(null);
  }, [cartSignature]);

  const selected = options?.find((o) => o.serviceId === selectedId) ?? null;
  const shipping = selected ? (free ? 0 : selected.price) : null;
  const total = subtotal + (shipping ?? 0);
  const canCheckout = items.length > 0 && selected !== null && !loading && !quoting;

  const handleQuote = async () => {
    if (quoting || !cepValid || items.length === 0) return;
    setQuoting(true);
    setQuoteError(null);
    setOptions(null);
    setSelectedId(null);
    try {
      const res = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: cepDigits,
          items: items.map((i) => ({ sku: i.sku, qty: i.qty })),
        }),
      });
      const data = (await res.json()) as
        | { ok: true; options: ShippingOption[] }
        | { ok: false; error: string };
      if (!res.ok || !data.ok) {
        setQuoteError(
          (!data.ok && data.error) ||
            "Não conseguimos calcular o frete agora. Tente novamente em instantes ou fale com a OverBerry para finalizar seu pedido."
        );
        return;
      }
      setOptions(data.options);
      if (data.options.length === 1) setSelectedId(data.options[0].serviceId);
    } catch {
      setQuoteError(
        "Não conseguimos calcular o frete agora. Tente novamente em instantes ou fale com a OverBerry para finalizar seu pedido."
      );
    } finally {
      setQuoting(false);
    }
  };

  const handleCheckout = async () => {
    if (loading || !selected) return; // evita duplo clique
    setLoading(true);
    setError(null);
    const res = await startCheckout({
      items: items.map((i) => ({ sku: i.sku, qty: i.qty })),
      shippingZip: cepDigits,
      shippingServiceId: selected.serviceId,
    });
    if (res.ok) {
      window.location.href = res.init_point; // redireciona ao Mercado Pago
      return; // mantém loading até a navegação
    }
    setError(res.error);
    setLoading(false);
  };

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-[70vh] bg-cream">
      <div className="mx-auto max-w-content px-5 py-10 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-body text-sm text-ink-soft transition-colors hover:text-purple-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Continuar comprando
        </Link>

        <div className="mt-4 flex items-end justify-between gap-4">
          <h1 className="font-display text-3xl text-ink md:text-4xl">Seu carrinho</h1>
          {items.length > 0 && (
            <span className="font-body text-sm text-ink-soft">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-white shadow-sm">
            <EmptyCart />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_380px]">
            {/* Itens */}
            <div className="self-start divide-y divide-line rounded-2xl border border-line bg-white px-5 shadow-sm">
              {items.map((item) => (
                <CartLineItem key={item.sku} item={item} />
              ))}
            </div>

            {/* Resumo */}
            <aside className="h-fit overflow-hidden rounded-2xl border border-line bg-white shadow-md md:sticky md:top-24">
              <div className="border-b border-line px-6 pb-5 pt-6">
                <h2 className="font-display text-xl text-ink">Resumo do pedido</h2>
                <div className="mt-4 rounded-xl bg-cream px-4 py-3 ring-1 ring-line">
                  <FreeShippingBar subtotal={subtotal} />
                </div>
              </div>

              <div className="px-6 py-5">
                {/* Frete por CEP */}
                <label className="eyebrow text-purple-600" htmlFor="cep">
                  Calcular frete
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="cep"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(maskCep(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleQuote();
                    }}
                    className="min-h-[52px] w-full rounded-xl border border-line bg-cream px-4 font-body text-ink transition-colors focus:border-purple-500 focus:outline focus:outline-2 focus:outline-purple-500"
                  />
                  <Button
                    variant="secondary"
                    disabled={!cepValid || quoting}
                    onClick={handleQuote}
                    className="shrink-0"
                  >
                    {quoting ? "Calculando…" : "Calcular"}
                  </Button>
                </div>

                {quoteError && (
                  <p role="alert" className="mt-3 rounded-xl border border-magenta/30 bg-purple-100 px-4 py-3 font-body text-xs text-magenta-soft">
                    {quoteError}
                  </p>
                )}

                {options && options.length > 0 && (
                  <fieldset className="mt-4">
                    <legend className="sr-only">Opções de frete</legend>
                    <div className="space-y-2">
                      {options.map((o) => {
                        const active = o.serviceId === selectedId;
                        return (
                          <label
                            key={o.serviceId}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
                              active
                                ? "border-purple-500 bg-purple-100/60 ring-1 ring-purple-500"
                                : "border-line bg-cream hover:border-purple-300"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="frete"
                                value={o.serviceId}
                                checked={active}
                                onChange={() => setSelectedId(o.serviceId)}
                                className="h-4 w-4 accent-purple-600"
                              />
                              <span className="font-body text-sm">
                                <span className="block font-semibold text-ink">
                                  {o.carrier} — {o.service}
                                </span>
                                <span className="block text-xs text-ink-soft">
                                  Até {o.deadline} {o.deadline === 1 ? "dia útil" : "dias úteis"}
                                </span>
                              </span>
                            </span>
                            <span className={`font-body text-sm font-semibold tabular-nums ${free ? "text-green-700" : "text-ink"}`}>
                              {free ? "Grátis" : brl(o.price)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {/* Totais */}
                <dl className="mt-5 space-y-2.5 border-t border-line pt-5 font-body text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="text-ink tabular-nums">{brl(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Frete</dt>
                    <dd className={`tabular-nums ${free && selected ? "font-semibold text-green-700" : "text-ink"}`}>
                      {shipping === null
                        ? "A calcular"
                        : shipping === 0
                          ? "Grátis"
                          : brl(shipping)}
                    </dd>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between border-t border-line pt-4">
                    <dt className="font-semibold text-ink">Total</dt>
                    <dd className="font-display text-2xl text-purple-700 tabular-nums">{brl(total)}</dd>
                  </div>
                </dl>

                <Button
                  fullWidth
                  className="mt-5"
                  disabled={!canCheckout}
                  onClick={handleCheckout}
                >
                  {loading ? "Redirecionando ao pagamento…" : "Finalizar compra"}
                </Button>

                {selected === null && (
                  <p className="mt-2 text-center font-body text-xs text-ink-soft">
                    {options && options.length > 0
                      ? "Escolha uma opção de frete para continuar."
                      : "Informe o CEP e calcule o frete para continuar."}
                  </p>
                )}

                {error && (
                  <p role="alert" className="mt-3 rounded-xl border border-magenta/30 bg-purple-100 px-4 py-3 text-center font-body text-xs text-magenta-soft">
                    {error}
                  </p>
                )}

                <p className="mt-3 text-center font-body text-xs text-ink-soft/80">
                  Você finaliza o pagamento no ambiente seguro do Mercado Pago.
                </p>

                <div className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
                  <p className="inline-flex items-center gap-2 font-body text-xs text-ink-soft">
                    <Icon name="lock" className="h-4 w-4 shrink-0 text-magenta" />
                    Compra segura · Pix, cartão e boleto
                  </p>
                  <p className="inline-flex items-center gap-2 font-body text-xs text-ink-soft">
                    <Icon name="shield" className="h-4 w-4 shrink-0 text-green-500" />
                    Atendimento direto com a OverBerry
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
