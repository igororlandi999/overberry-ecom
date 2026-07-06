"use client";

import Image from "next/image";
import QuantityStepper from "./QuantityStepper";
import { useCart, type CartItem } from "@/lib/cart";
import { brl } from "@/lib/format";

export default function CartLineItem({
  item,
  compact = false,
}: {
  item: CartItem;
  compact?: boolean;
}) {
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className={`flex gap-4 ${compact ? "py-4" : "py-5"}`}>
      <div
        className={`${
          compact ? "h-[68px] w-[54px]" : "h-[92px] w-[74px]"
        } shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-line shadow-sm`}
      >
        <Image
          src="/embalagem-hero.png"
          alt=""
          width={148}
          height={185}
          className="h-full w-full object-contain p-1"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className={`font-body ${compact ? "text-sm" : "text-base"} font-semibold leading-snug text-ink`}>
            {item.name}
          </p>
          <button
            type="button"
            aria-label="Remover item"
            onClick={() => removeItem(item.sku)}
            className="-mr-1 -mt-1 inline-flex shrink-0 items-center gap-1 rounded-md p-1 font-body text-xs text-ink-soft transition-colors hover:text-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-purple-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span className="hidden sm:inline">Remover</span>
          </button>
        </div>

        <p className="mt-0.5 font-body text-xs text-ink-soft tabular-nums">
          {brl(item.price)} <span className="text-ink-soft/70">/ unidade</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            qty={item.qty}
            onChange={(next) => updateQty(item.sku, next)}
            size={compact ? "sm" : "md"}
          />
          <span className={`font-display ${compact ? "text-base" : "text-lg"} text-ink tabular-nums`}>
            {brl(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}
