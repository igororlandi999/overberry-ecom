"use client";

import { useState } from "react";
import { offers, product } from "@/lib/content";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";

export default function InlineCta({
  label = "Adicionar ao carrinho",
}: {
  label?: string;
}) {
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const offer = offers[0];

  return (
    <Button
      className="w-full md:w-auto"
      onClick={() => {
        addItem({ sku: offer.sku, name: `${product.name} ${product.weight} — ${offer.label}`, price: offer.price });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
    >
      {added ? "Adicionado ao carrinho" : label}
    </Button>
  );
}
