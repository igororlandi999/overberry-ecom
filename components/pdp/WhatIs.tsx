import Image from "next/image";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";

export default function WhatIs() {
  return (
    <Section bg="white" grain>
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <Reveal>
          <span className="eyebrow text-green-700">O produto</span>
          <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
            O que é o açaí liofilizado em pó
          </h2>
          <p className="mt-5 max-w-prose font-body text-ink-soft md:text-lg">
            É o açaí da Amazônia desidratado a frio, por liofilização — um processo que remove a água
            preservando cor, sabor e características naturais do fruto. O resultado é um pó 100% açaí,
            sem açúcar adicionado, que você mistura no que quiser.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-cream p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <Icon name="snow" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-body text-sm font-semibold text-ink">Desidratado a frio</p>
              <p className="mt-0.5 font-body text-sm text-ink-soft">
                A liofilização preserva melhor cor, sabor e nutrientes do que a secagem por calor.
              </p>
            </div>
          </div>

          <ButtonLink href="#economia" variant="secondary" className="mt-6 w-full md:w-auto">
            Ver quanto rende
          </ButtonLink>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-[440px]">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[32px] blur-2xl"
              style={{ background: "radial-gradient(circle at 60% 40%, rgba(184,58,130,0.18), transparent 70%)" }}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] shadow-plum ring-1 ring-black/5">
              <Image
                src="/po-colher.png"
                alt="Açaí liofilizado em pó numa colher de madeira"
                fill
                sizes="(max-width: 768px) 90vw, 440px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
