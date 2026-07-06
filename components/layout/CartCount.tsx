"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui";
import Icon from "@/components/ui/Icon";

export default function CartCount() {
  const count = useCart((s) => s.count());
  const openCart = useUI((s) => s.openCart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const value = mounted ? count : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrinho${value > 0 ? ` (${value})` : ""}`}
      className="relative inline-flex min-h-[40px] items-center gap-2 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-purple-700 shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
    >
      <Icon name="bag" className="h-[18px] w-[18px]" />
      <span className="font-body text-sm font-semibold">Carrinho</span>
      {value > 0 && (
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-magenta px-1 font-body text-xs font-semibold text-cream">
          {value}
        </span>
      )}
    </button>
  );
}
