import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/lib/content";

const pains: { icon: IconName; label: string }[] = [
  { icon: "snow", label: "Freezer lotado de polpa" },
  { icon: "spoon", label: "Bagunça no preparo" },
  { icon: "nosugar", label: "Mistura com açúcar e xarope" },
  { icon: "clock", label: "Preparo demorado" },
];

export default function ProblemHook() {
  return (
    <Section bg="cream" grain>
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <Reveal>
          <span className="eyebrow text-magenta-soft">O problema</span>
          <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
            Açaí de verdade não deveria depender de freezer, bagunça e preparo complicado.
          </h2>
          <p className="mt-5 max-w-prose font-body text-ink-soft md:text-lg">
            O açaí virou complicação. A OverBerry resolve isso: açaí puro, em pó, que você guarda na
            prateleira e prepara em segundos.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-2xl border border-line bg-white/70 p-5 shadow-sm backdrop-blur-sm md:p-6">
            <span className="eyebrow text-ink-soft/70">Sem a OverBerry</span>
            <ul className="mt-4 space-y-3">
              {pains.map((p) => (
                <li key={p.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-ink-soft">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-body text-sm text-ink-soft line-through decoration-magenta/40 decoration-1">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
