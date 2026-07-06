import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import { uses } from "@/lib/content";

export default function HowToUse() {
  return (
    <Section bg="cream" grain id="como-usar">
      <Reveal>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-green-700">Modo de uso</span>
            <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
              1 scoop é só o começo
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-purple-200 bg-white px-4 py-2 shadow-sm md:self-auto">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-cream">
              <Icon name="spoon" className="h-4 w-4" />
            </span>
            <span className="font-body text-sm text-ink">
              <strong className="font-semibold">1 scoop = 5g</strong> · medidor gratuito incluso
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {uses.map((u, i) => (
          <Reveal key={u.title} delay={(i % 4) * 70}>
            <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl text-purple-200 transition-colors group-hover:text-magenta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <Icon name={u.icon} className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg text-ink">{u.title}</h3>
              <p className="mt-2 font-body text-sm text-ink-soft">{u.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
