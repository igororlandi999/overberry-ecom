import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import { benefits } from "@/lib/content";

export default function Benefits() {
  return (
    <Section bg="cream" grain>
      <Reveal>
        <span className="eyebrow text-magenta-soft">Por que OverBerry</span>
        <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
          Benefícios que cabem na sua rotina
        </h2>
      </Reveal>

      <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-4">
        {benefits.map((b, i) => (
          <Reveal
            key={b.title}
            delay={(i % 4) * 70}
            className={b.highlight ? "md:col-span-2" : "md:col-span-1"}
          >
            <article
              className={`group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 ${
                b.highlight
                  ? "border-purple-200 bg-white shadow-md hover:shadow-glow"
                  : "border-line bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {b.highlight && (
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(184,58,130,0.16), transparent 70%)" }}
                />
              )}
              <span
                className={`relative flex h-12 w-12 items-center justify-center rounded-full ${
                  b.highlight ? "bg-purple-700 text-cream" : "bg-purple-100 text-purple-700"
                }`}
              >
                <Icon name={b.icon} className="h-6 w-6" />
              </span>
              <h3
                className={`relative mt-4 font-display text-purple-700 ${
                  b.highlight ? "text-2xl" : "text-lg"
                }`}
              >
                {b.title}
              </h3>
              <p className="relative mt-2 max-w-prose font-body text-sm text-ink-soft">{b.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
