import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import InlineCta from "./InlineCta";
import { comparison } from "@/lib/content";

export default function Comparison() {
  const last = comparison.length - 1;

  return (
    <Section bg="dark" grain glow id="comparativo">
      <Reveal>
        <span className="eyebrow text-magenta">Comparativo</span>
        <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-cream md:text-4xl">
          OverBerry x polpa de açaí congelada
        </h2>
        <p className="mt-4 max-w-prose font-body text-cream/60">
          O mesmo açaí, sem as limitações da polpa congelada.
        </p>
      </Reveal>

      {/* Desktop: coluna OverBerry destacada como banda contínua */}
      <Reveal delay={100} className="mt-9 hidden md:block">
        <div className="grid grid-cols-[1.3fr_1fr_1fr]">
          <div />
          <div className="rounded-t-2xl bg-white/[0.07] px-6 pb-3 pt-5 text-center ring-1 ring-white/10">
            <span className="eyebrow text-magenta">OverBerry</span>
          </div>
          <div className="px-6 pb-3 pt-5 text-center">
            <span className="eyebrow text-cream/45">Polpa congelada</span>
          </div>

          {comparison.map((r, i) => (
            <div key={r.feature} className="contents">
              <div className="flex items-center border-t border-white/10 py-4 pr-4 font-display text-cream/80">
                {r.feature}
              </div>
              <div
                className={`flex items-center gap-2.5 border-t border-white/10 bg-white/[0.07] px-6 py-4 ring-1 ring-white/10 ${
                  i === last ? "rounded-b-2xl" : ""
                }`}
              >
                <Icon name="check" className="h-4 w-4 shrink-0 text-magenta" />
                <span className="font-body text-cream">{r.over}</span>
              </div>
              <div className="flex items-center border-t border-white/10 px-6 py-4 font-body text-cream/45">
                {r.pulp}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Mobile: um bloco por atributo */}
      <div className="mt-8 space-y-3 md:hidden">
        {comparison.map((r) => (
          <div key={r.feature} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-display text-cream">{r.feature}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.07] px-3 py-2 ring-1 ring-white/10">
                <Icon name="check" className="h-4 w-4 shrink-0 text-magenta" />
                <span className="eyebrow text-magenta">OverBerry</span>
                <span className="ml-auto text-right font-body text-sm text-cream">{r.over}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="eyebrow text-cream/40">Polpa</span>
                <span className="ml-auto text-right font-body text-sm text-cream/45">{r.pulp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Reveal delay={80} className="mt-9">
        <InlineCta label="Quero açaí sem freezer" />
      </Reveal>
    </Section>
  );
}
