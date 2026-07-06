"use client";

import { useState } from "react";
import clsx from "clsx";
import { offers, product } from "@/lib/content";
import { brl } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export default function BuyBox() {
  const [selected, setSelected] = useState(offers[0].sku);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const offer = offers.find((o) => o.sku === selected)!;

  const handleAdd = () => {
    addItem({
      sku: offer.sku,
      name: `${product.name} ${product.weight} — ${offer.label}`,
      price: offer.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="rounded-[20px] border border-line bg-cream p-5 text-ink shadow-plum md:p-6">
      {/* Preço */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="font-display text-4xl leading-none text-ink md:text-5xl">
            {brl(offer.price)}
          </span>
          <p className="mt-1.5 font-body text-sm text-ink-soft">
            ~{brl(offer.perServing)} por porção · até {offer.servings} porções
          </p>
        </div>
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[0.7rem] font-semibold text-green-700">
          Frete grátis acima de {brl(FREE_SHIPPING_THRESHOLD)}
        </span>
      </div>

      {/* Seletor de kit */}
      <div
        className="mt-5 grid grid-cols-3 gap-2"
        role="radiogroup"
        aria-label="Escolha a quantidade"
      >
        {offers.map((o) => {
          const active = selected === o.sku;
          return (
            <button
              key={o.sku}
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(o.sku)}
              className={clsx(
                "relative flex flex-col items-center rounded-xl border px-2 py-3 text-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta",
                active
                  ? "border-purple-700 bg-purple-700 text-cream shadow-md"
                  : "border-line bg-white text-ink hover:border-purple-300"
              )}
            >
              {o.badge && (
                <span
                  className={clsx(
                    "absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide",
                    active ? "bg-magenta text-cream" : "bg-purple-100 text-purple-700"
                  )}
                >
                  {o.badge}
                </span>
              )}
              <span className="font-body text-xs font-semibold">{o.label}</span>
              <span className={clsx("mt-0.5 font-body text-xs", active ? "text-cream/80" : "text-ink-soft")}>
                {brl(o.price)}
              </span>
              <span className={clsx("mt-0.5 font-body text-[0.65rem]", active ? "text-cream/70" : "text-ink-soft/80")}>
                ~{brl(o.perServing)}/porção
              </span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={handleAdd}
        className="group mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-purple-700 font-body font-semibold text-cream transition-all hover:bg-purple-600 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
      >
        {added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
        {!added && (
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        )}
      </button>

      <p className="mt-3 text-center font-body text-xs text-ink-soft">
        Compra segura · Atendimento direto com a OverBerry
      </p>
    </div>
  );
}
