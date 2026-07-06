import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { nutrition, specs } from "@/lib/content";

export default function NutritionSpecs() {
  return (
    <Section bg="white" grain>
      <Reveal>
        <span className="eyebrow text-purple-600">Ficha técnica</span>
        <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
          Transparência total
        </h2>
      </Reveal>

      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {/* Nutricional */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-cream shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-display text-lg text-ink">Informações nutricionais</h3>
              <span className="eyebrow text-ink-soft/70">Porção 5g · 1 scoop</span>
            </div>
            <dl className="divide-y divide-line">
              {nutrition.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-6 py-3">
                  <dt className={`font-body text-sm ${row.strong ? "font-semibold text-ink" : "text-ink-soft"}`}>
                    {row.label}
                  </dt>
                  <dd
                    className={`font-body tabular-nums ${
                      row.strong ? "font-semibold text-purple-700" : "text-ink"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Especificações */}
        <Reveal delay={100}>
          <div className="overflow-hidden rounded-2xl border border-line bg-cream shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-display text-lg text-ink">Especificações</h3>
              <span className="eyebrow text-ink-soft/70">Sobre o produto</span>
            </div>
            <dl className="divide-y divide-line">
              {specs.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-6 py-3">
                  <dt className="font-body text-sm text-ink-soft">{row.label}</dt>
                  <dd className="text-right font-body text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
