import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/ui/Accordion";
import { faq } from "@/lib/content";

export default function Faq() {
  return (
    <Section bg="cream" grain>
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <Reveal>
          <span className="eyebrow text-magenta-soft">Dúvidas frequentes</span>
          <h2 className="mt-3 font-display text-[1.8rem] leading-[1.1] text-ink md:text-4xl">
            Perguntas e respostas
          </h2>
          <p className="mt-4 font-body text-ink-soft">
            Tudo que você precisa saber antes de experimentar.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={faq} />
        </Reveal>
      </div>
    </Section>
  );
}
