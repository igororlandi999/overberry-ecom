import Link from "next/link";
import Grain from "@/components/ui/Grain";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-plum-950 px-5 pb-8 pt-14 text-cream">
      <Grain opacity={0.06} />
      <div className="relative mx-auto max-w-content">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-cream">OverBerry</p>
            <p className="mt-3 max-w-xs font-body text-sm text-cream/60">
              Açaí liofilizado em pó, 100% natural, do Norte do Brasil. O pigmento vivo da Amazônia
              na sua rotina.
            </p>
          </div>

          <nav aria-label="Navegação" className="flex flex-col gap-2.5">
            <span className="eyebrow text-cream/40">Explorar</span>
            <Link href="#como-usar" className="font-body text-sm text-cream/70 transition-colors hover:text-cream">Modo de uso</Link>
            <Link href="#economia" className="font-body text-sm text-cream/70 transition-colors hover:text-cream">Economia</Link>
            <Link href="#comparativo" className="font-body text-sm text-cream/70 transition-colors hover:text-cream">Comparativo</Link>
            <Link href="#kits" className="font-body text-sm text-cream/70 transition-colors hover:text-cream">Kits</Link>
          </nav>

          <div className="flex flex-col gap-2.5">
            <span className="eyebrow text-cream/40">Confiança</span>
            <p className="font-body text-sm text-cream/70">Compra segura · Pix, cartão e boleto</p>
            <p className="font-body text-sm text-cream/70">Atendimento direto com a OverBerry</p>
            <p className="font-body text-sm text-cream/70">Produto regularizado e rotulado conforme a legislação brasileira</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-xs text-cream/40">© {year} OverBerry. Todos os direitos reservados.</p>
          <p className="font-body text-xs text-cream/40">Feito no Brasil</p>
        </div>
      </div>
    </footer>
  );
}
