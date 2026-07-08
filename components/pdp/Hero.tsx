import HeroVisual from "./HeroVisual";
import BuyBox from "./BuyBox";
import Grain from "@/components/ui/Grain";
import Icon from "@/components/ui/Icon";
import { product, offers, type IconName } from "@/lib/content";
import { brl } from "@/lib/format";

const chipIcons: Record<string, IconName> = {
  "100% natural": "leaf",
  "Sem açúcar adicionado": "nosugar",
  "Freeze dried": "snow",
  "Até 20 porções": "servings",
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-plum-950 text-cream">
      {/* atmosfera: gradiente + glow ambiente + grão */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 20%, #2A0E26 0%, #1A0817 60%, #150611 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -left-1/4 top-1/3 h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(184,58,130,0.22), transparent 70%)" }}
      />
      <Grain opacity={0.08} />

      {/*
        Ordem mobile (fluxo de conversão): headline → embalagem → rendimento/chips/compra.
        Desktop: visual à esquerda ocupando as duas linhas, conteúdo à direita.
      */}
      <div className="relative mx-auto grid max-w-content gap-8 px-5 pb-14 pt-10 md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-x-14 md:gap-y-6 md:py-20">
        {/* Bloco 1 — headline */}
        <div className="md:col-start-2 md:row-start-1 md:self-end">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-green-500">
            <Icon name="leaf" className="h-3.5 w-3.5" />
            Do coração da Amazônia para você
          </span>

          <h1 className="mt-3 font-display text-[2.4rem] font-semibold leading-[1.05] text-cream md:text-6xl">
            {product.h1}
          </h1>

          <p className="mt-5 max-w-prose font-body text-cream/70 md:text-lg">
            {product.subtitle}
          </p>
        </div>

        {/* Bloco 2 — visual heroico */}
        <div className="md:col-start-1 md:row-span-2 md:row-start-1 md:self-center">
          <HeroVisual />
        </div>

        {/* Bloco 3 — rendimento + chips + compra */}
        <div className="md:col-start-2 md:row-start-2">
          {/* Afirmação central de rendimento */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-magenta/25 bg-white/[0.05] px-5 py-4 backdrop-blur-[2px]">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-magenta/25 blur-3xl"
            />
            <div className="relative flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-magenta/15 ring-1 ring-magenta/30">
                <Icon name="bowl" className="h-6 w-6 text-magenta" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[1.55rem] font-semibold leading-none text-cream md:text-3xl">
                  {product.heroYield.powder}{" "}
                  <span className="font-body text-sm font-normal text-cream/55 md:text-base">
                    {product.heroYield.powderLabel}
                  </span>
                  <span className="mx-2 text-magenta" aria-hidden="true">
                    =
                  </span>
                  <span className="sr-only">equivale a</span>
                  {product.heroYield.prepared}{" "}
                  <span className="font-body text-sm font-normal text-cream/55 md:text-base">
                    {product.heroYield.preparedLabel}
                  </span>
                </p>
                <p className="mt-1.5 font-body text-xs text-cream/50 md:text-sm">
                  Até {offers[0].servings} porções de açaí de verdade, a ~{brl(offers[0].perServing)} cada.
                </p>
              </div>
            </div>
          </div>

          {/* chips com ícones */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.heroBadges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-white/[0.03] px-3 py-1.5 font-body text-xs text-cream/80"
              >
                {chipIcons[b] && <Icon name={chipIcons[b]} className="h-3.5 w-3.5 text-green-500" />}
                {b}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <BuyBox />
          </div>
        </div>
      </div>
    </section>
  );
}
