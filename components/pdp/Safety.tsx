import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/lib/content";

const items: { icon: IconName; title: string; text: string }[] = [
  { icon: "lock", title: "Compra 100% segura", text: "Pagamento protegido. Pix, cartão ou boleto." },
  { icon: "shield", title: "Atendimento direto", text: "Compra segura e atendimento direto com a OverBerry." },
  { icon: "doc", title: "Regularizado", text: "Produto regularizado e rotulado conforme a legislação brasileira." },
];

export default function Safety() {
  return (
    <Section bg="white">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 70}>
            <div className="flex h-full items-start gap-4 rounded-2xl border border-line bg-cream p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-purple-700 ring-1 ring-purple-100">
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base text-ink">{it.title}</h3>
                <p className="mt-1 font-body text-sm text-ink-soft">{it.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
