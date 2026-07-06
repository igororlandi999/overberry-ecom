"use client";

import { useState } from "react";
import Image from "next/image";

type Slot = {
  kind: "product" | "photo";
  src: string;
  alt: string;
  label: string;
};

const slots: Slot[] = [
  {
    kind: "product",
    src: "/embalagem-hero.png",
    alt: "Embalagem OverBerry — Açaí Liofilizado em Pó 100g",
    label: "Embalagem",
  },
  {
    kind: "photo",
    src: "/po-colher.png",
    alt: "Açaí liofilizado em pó numa colher de madeira",
    label: "Pó na colher",
  },
  {
    kind: "photo",
    src: "/preparo-acai.png",
    alt: "Preparo do açaí — pó caindo no copo",
    label: "Preparo",
  },
  {
    kind: "photo",
    src: "/bowl-acai.png",
    alt: "Bowl de açaí com frutas e granola",
    label: "Bowl pronto",
  },
];

export default function HeroVisual() {
  const [active, setActive] = useState(0);
  const current = slots[active];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Palco */}
      <div className="relative aspect-[4/5] w-full max-w-[480px]">
        {/* glow magenta atrás */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(184,58,130,0.50), rgba(184,58,130,0) 70%)" }}
        />

        {current.kind === "product" ? (
          // Produto: flutua livre, sem moldura
          <div className="relative h-full w-full motion-safe:animate-floaty">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              priority
              sizes="(max-width: 768px) 82vw, 480px"
              className="object-contain drop-shadow-[0_28px_36px_rgba(26,8,23,0.6)]"
            />
          </div>
        ) : (
          // Foto: prancha editorial emoldurada
          <div className="relative h-full w-full overflow-hidden rounded-[20px] shadow-plum ring-1 ring-white/10">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 768px) 82vw, 480px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Thumbnails — mesmo tamanho, crop consistente, hover e ativo claros */}
      <div className="flex w-full max-w-[480px] justify-center gap-2.5">
        {slots.map((slot, i) => (
          <button
            key={slot.src}
            onClick={() => setActive(i)}
            aria-label={slot.alt}
            aria-current={active === i}
            title={slot.label}
            className={`relative aspect-[4/5] w-[62px] overflow-hidden rounded-xl bg-gradient-to-b from-purple-900 to-plum-950 transition-all duration-200 ${
              active === i
                ? "ring-2 ring-magenta ring-offset-2 ring-offset-plum-950"
                : "opacity-65 ring-1 ring-white/10 hover:opacity-100 hover:ring-white/25"
            }`}
          >
            <Image
              src={slot.src}
              alt=""
              fill
              sizes="62px"
              className={slot.kind === "product" ? "object-contain p-1.5" : "object-cover"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
