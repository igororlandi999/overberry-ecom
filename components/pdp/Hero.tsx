import HeroVisual from "./HeroVisual";
import BuyBox from "./BuyBox";
import Grain from "@/components/ui/Grain";
import { product } from "@/lib/content";

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

      <div className="relative mx-auto grid max-w-content items-center gap-10 px-5 pb-14 pt-10 md:grid-cols-2 md:gap-14 md:py-20">
        {/* Visual */}
        <div className="order-1 md:order-none">
          <HeroVisual />
        </div>

        {/* Conteúdo */}
        <div className="order-2 flex flex-col md:order-none">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-green-500">
            Açaí liofilizado · pigmento vivo da Amazônia
          </span>

          <h1 className="mt-3 font-display text-[2.4rem] font-semibold leading-[1.05] text-cream md:text-6xl">
            {product.h1}
          </h1>

          <p className="mt-5 max-w-prose font-body text-cream/70 md:text-lg">
            {product.subtitle}
          </p>

          {/* chips elegantes */}
          <div className="mt-5 flex flex-wrap gap-2">
            {product.heroBadges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-cream/15 px-3 py-1 font-body text-xs text-cream/80"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="mt-7">
            <BuyBox />
          </div>
        </div>
      </div>

    </section>
  );
}
