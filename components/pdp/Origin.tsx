import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import Grain from "@/components/ui/Grain";

const marks: { icon: "leaf" | "snow" | "drop"; label: string }[] = [
  { icon: "leaf", label: "Amazônia brasileira" },
  { icon: "leaf", label: "Colhido de forma sustentável" },
  { icon: "snow", label: "Liofilização freeze dried" },
];

export default function Origin() {
  return (
    <Section bg="cream" grain>
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Reveal>
          <span className="eyebrow text-green-700">Origem</span>
          <h2 className="mt-3 font-display text-[1.9rem] leading-[1.05] text-ink md:text-5xl">
            Do Norte do Brasil, com a tecnologia certa
          </h2>
          <p className="mt-5 max-w-prose font-body text-ink-soft md:text-lg">
            Nosso açaí vem da Amazônia brasileira, colhido de forma sustentável no Norte do país.
            É açaí de verdade, na origem.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {marks.map((m) => (
              <li
                key={m.label}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2"
              >
                <Icon name={m.icon} className="h-4 w-4 text-green-700" />
                <span className="font-body text-sm text-ink">{m.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Painel tonal escuro dentro da seção clara = atmosfera premium */}
        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-[24px] bg-plum-950 p-7 text-cream shadow-plum md:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-[90px]"
              style={{ background: "radial-gradient(circle, rgba(184,58,130,0.28), transparent 70%)" }}
            />
            <Grain opacity={0.08} />
            <div className="relative">
              <span className="eyebrow text-magenta">O processo</span>
              <p className="mt-4 font-display text-xl leading-snug text-cream md:text-2xl">
                A liofilização desidrata o açaí a frio, sem cozinhar nem aquecer.
              </p>
              <p className="mt-4 font-body text-cream/70">
                Por isso preserva melhor cor, sabor e características naturais do fruto do que
                processos que secam por calor. Açaí puro, concentrado, em pó.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
