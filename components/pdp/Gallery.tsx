"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

type Slot =
  | { type: "image"; src: string; alt: string }
  | { type: "placeholder"; label: string };

const slots: Slot[] = [
  { type: "image", src: "/embalagem.jpg", alt: "Embalagem OverBerry — Açaí Liofilizado em Pó 100g" },
  { type: "placeholder", label: "Pó na colher (medidor)" },
  { type: "placeholder", label: "Preparo (pó caindo)" },
  { type: "placeholder", label: "Bowl ou smoothie pronto" },
];

export default function Gallery() {
  const [active, setActive] = useState(0);
  const current = slots[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg bg-white">
        {current.type === "image" ? (
          <Image
            src={current.src}
            alt={current.alt}
            width={840}
            height={1050}
            priority
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <PlaceholderImage label={current.label} />
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={
              slot.type === "image" ? slot.alt : `Placeholder: ${slot.label}`
            }
            aria-current={active === i}
            className={`overflow-hidden rounded-md border transition-colors ${
              active === i ? "border-purple-600" : "border-line hover:border-purple-200"
            }`}
          >
            {slot.type === "image" ? (
              <Image
                src={slot.src}
                alt=""
                width={210}
                height={262}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <span className="flex aspect-[4/5] w-full items-center justify-center bg-purple-100/40 p-1 text-center text-[10px] leading-tight text-purple-500">
                {slot.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
