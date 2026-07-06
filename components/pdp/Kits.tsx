"use client";

import { useState } from "react";
import clsx from "clsx";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import { offers, product } from "@/lib/content";
import { brl } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

const UNIT_PRICE = offers[0].price;

export default function Kits() {
  const addItem = useCart((s) => s.addItem);
  const [addedSku, setAddedSku] = useState<string | null>(null);

  const add = (sku: string) => {
    const o = offers.find((x) => x.sku === sku)!;
    addItem({ sku: o.sku, name: `${product.name} ${product.weight} — ${o.label}`, price: o.price });
    setAddedSku(sku);
    setTimeout(() => setAddedSku((s) => (s === sku ? null : s)), 2000);
  };

  return (
    <Section bg="cream" grain id="kits">
      <Reveal>
        <span className="eyebrow text-magenta-soft">Kits</span>
        <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
          Quanto mais, menor o custo por porção
        </h2>
        <p className="mt-4 max-w-prose font-body text-ink-soft">
          Frete grátis acima de {brl(FREE_SHIPPING_THRESHOLD)}. Kits 2 e 3 já saem com frete incluído.
        </p>
      </Reveal>

      <div className="mt-9 grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-5">
        {offers.map((o, i) => {
          const featured = o.highlight;
          const perUnit = o.price / o.units;
          const savings = o.units * UNIT_PRICE - o.price;
          const freeShip = o.price >= FREE_SHIPPING_THRESHOLD;
          const badge = o.badge
            ? { text: o.badge, tone: "magenta" as const }
            : o.units === 3
              ? { text: "Melhor economia", tone: "green" as const }
              : null;

          return (
            <Reveal key={o.sku} delay={i * 80} className="h-full">
              <div
                className={clsx(
                  "relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-white p-6 transition-all duration-200 md:p-7",
                  featured
                    ? "border-purple-300 shadow-md hover:shadow-glow md:-translate-y-2 md:scale-[1.02]"
                    : o.units === 3
                      ? "border-green-500/40 shadow-sm hover:-translate-y-1 hover:shadow-md"
                      : "border-line shadow-sm hover:-translate-y-1 hover:shadow-md"
                )}
              >
                {featured && (
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl"
                    style={{ background: "radial-gradient(circle, rgba(184,58,130,0.18), transparent 70%)" }}
                  />
                )}

                <div className="relative flex min-h-[26px] items-center justify-between">
                  <h3 className="font-display text-xl text-ink">{o.label}</h3>
                  {badge && (
                    <span
                      className={clsx(
                        "whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide",
                        badge.tone === "magenta" ? "bg-magenta text-cream" : "bg-green-500 text-cream"
                      )}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>

                <div className="relative mt-4">
                  {savings > 0.01 && (
                    <p className="font-body text-sm text-ink-soft/70">
                      de <span className="line-through decoration-magenta/50">{brl(o.units * UNIT_PRICE)}</span> por
                    </p>
                  )}
                  <p className="font-display text-4xl leading-none text-purple-700">
                    {brl(o.price)}
                  </p>
                </div>

                <div className="relative mt-3 space-y-1 font-body text-sm text-ink-soft">
                  {o.units > 1 && (
                    <p>
                      <span className="font-semibold text-ink">{brl(perUnit)}</span> por unidade
                    </p>
                  )}
                  <p>
                    <span className="font-semibold text-ink">~{brl(o.perServing)}</span> por porção · até{" "}
                    {o.servings} porções
                  </p>
                </div>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  {savings > 0.01 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 font-body text-xs font-semibold text-green-700">
                      <Icon name="check" className="h-3.5 w-3.5" />
                      Economize {brl(savings)}
                    </span>
                  )}
                  {freeShip && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 font-body text-xs font-semibold text-purple-700">
                      <Icon name="check" className="h-3.5 w-3.5" />
                      Frete grátis
                    </span>
                  )}
                </div>

                <div className="relative mt-auto pt-6">
                  <button
                    onClick={() => add(o.sku)}
                    className={clsx(
                      "group/btn flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full font-body font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta",
                      o.units === 1
                        ? "border border-purple-700 text-purple-700 hover:bg-purple-100"
                        : "bg-purple-700 text-cream hover:bg-purple-600 hover:shadow-glow"
                    )}
                  >
                    {addedSku === o.sku ? "Adicionado" : o.units === 1 ? "Adicionar" : `Levar ${o.label}`}
                    {addedSku !== o.sku && (
                      <span className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true">
                        →
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
