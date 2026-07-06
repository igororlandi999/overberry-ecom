import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { brl } from "@/lib/format";
import { offers } from "@/lib/content";

export default function Economy() {
  return (
    <Section bg="dark" grain glow id="economia">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <Reveal>
          <span className="eyebrow text-magenta">A conta fecha</span>
          <div className="mt-4">
            <p className="whitespace-nowrap font-display text-[3.4rem] leading-[0.9] text-cream md:text-[7rem]">
              {brl(offers[0].perServing)}
            </p>
            <p className="mt-1 font-body text-cream/60 md:text-lg">por porção</p>
          </div>
          <p className="mt-5 max-w-prose font-body text-cream/70 md:text-lg">
            Cada pacote de 100g rende até 20 porções de açaí 100% natural, em casa, sem açúcar e sem
            complicação. Uma tigela de açaí na rua sai bem mais cara — e quase sempre cheia de açúcar
            e xarope.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <p className="font-display text-5xl text-cream md:text-6xl">20</p>
              <p className="eyebrow mt-2 text-cream/60">porções por pacote</p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <p className="font-display text-5xl text-magenta md:text-6xl">0g</p>
              <p className="eyebrow mt-2 text-cream/60">açúcar adicionado</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <p className="font-body text-cream/80">
                <span className="font-display text-2xl text-cream">100g</span> que acompanham sua
                rotina por semanas — não um pote que acaba em dois dias.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
