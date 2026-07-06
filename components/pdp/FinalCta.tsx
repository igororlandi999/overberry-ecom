"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import InlineCta from "./InlineCta";

export default function FinalCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!email.trim()) return;
    // PLACEHOLDER: proxima fase envia para /api/lead (Supabase) com UTM.
    setSent(true);
  };

  return (
    <Section bg="dark" grain glow>
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <Reveal>
          <span className="eyebrow text-magenta">Comece agora</span>
          <h2 className="mt-3 font-display text-[2rem] leading-[1.05] text-cream md:text-5xl">
            Açaí de verdade, na sua rotina
          </h2>
          <p className="mt-5 max-w-prose font-body text-cream/70 md:text-lg">
            100% natural, do Norte do Brasil, sem açúcar e sem freezer. Pronto em segundos, rende até
            20 porções.
          </p>
          <div className="mt-7 max-w-sm">
            <InlineCta />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[24px] bg-white/[0.06] p-7 ring-1 ring-white/10 md:p-8">
            <h3 className="font-display text-xl text-cream">Receba receitas e novidades</h3>
            <p className="mt-2 font-body text-sm text-cream/60">
              Ideias de uso e novidades da OverBerry. Sem spam.
            </p>
            {sent ? (
              <p className="mt-5 rounded-xl bg-white/[0.06] px-4 py-3 font-body text-cream/80 ring-1 ring-white/10">
                Pronto. Em breve você recebe novidades.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  aria-label="E-mail"
                  className="min-h-[52px] flex-1 rounded-full border border-white/15 bg-plum-950 px-5 font-body text-cream placeholder:text-cream/35 focus:border-magenta focus:outline-none"
                />
                <button
                  onClick={submit}
                  className="min-h-[52px] rounded-full bg-cream px-6 font-body font-semibold text-plum-950 transition-colors hover:bg-white sm:w-auto"
                >
                  Quero receber
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
