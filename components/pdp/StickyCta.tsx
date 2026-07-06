"use client";

import { useEffect, useRef, useState } from "react";
import { offers, product } from "@/lib/content";
import { brl } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const offer = offers[0];
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const heroPassed = y > 520;
      const kits = document.getElementById("kits");
      const final = kits ? kits.getBoundingClientRect().top < window.innerHeight : false;
      setVisible(heroPassed && !final);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const add = () => {
    addItem({ sku: offer.sku, name: `${product.name} ${product.weight} — ${offer.label}`, price: offer.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(31,20,28,0.10)] transition-transform md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg leading-none text-ink">{brl(offer.price)}</p>
          <p className="font-body text-xs text-ink-soft">~{brl(offer.perServing)}/porção</p>
        </div>
        <Button onClick={add} className="flex-1">
          {added ? "Adicionado" : "Adicionar ao carrinho"}
        </Button>
      </div>
    </div>
  );
}
