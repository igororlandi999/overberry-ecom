"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/ui";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";
import CartLineItem from "./CartLineItem";
import EmptyCart from "./EmptyCart";
import FreeShippingBar from "./FreeShippingBar";
import Grain from "@/components/ui/Grain";
import { ButtonLink } from "@/components/ui/Button";

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden"; // trava o scroll do fundo
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-50 bg-plum-950/50 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Carrinho"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-plum transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header premium (plum + grão) */}
        <header className="relative overflow-hidden bg-plum-950 px-5 py-4 text-cream">
          <Grain opacity={0.06} />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg leading-none text-cream">Seu carrinho</h2>
              <p className="mt-1 font-body text-xs text-cream/50">
                {itemCount === 0
                  ? "Nenhum item ainda"
                  : `${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fechar carrinho"
              onClick={close}
              className="grid h-9 w-9 place-items-center rounded-full text-cream/70 transition-colors hover:bg-white/10 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-magenta"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyCart onAction={close} />
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((item) => (
                <CartLineItem key={item.sku} item={item} compact />
              ))}
            </div>

            <footer className="border-t border-line bg-white px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="rounded-xl bg-cream px-4 py-3 ring-1 ring-line">
                <FreeShippingBar subtotal={subtotal} />
              </div>

              <div className="mb-4 mt-4 flex items-baseline justify-between">
                <span className="font-body text-sm text-ink-soft">Subtotal</span>
                <span className="font-display text-2xl text-ink tabular-nums">{brl(subtotal)}</span>
              </div>

              <ButtonLink href="/carrinho" fullWidth onClick={close}>
                Revisar e finalizar
              </ButtonLink>

              <button
                type="button"
                onClick={close}
                className="mt-3 w-full font-body text-sm text-ink-soft transition-colors hover:text-purple-700"
              >
                Continuar comprando
              </button>

              <p className="mt-3 text-center font-body text-xs text-ink-soft/80">
                Frete calculado no próximo passo
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
