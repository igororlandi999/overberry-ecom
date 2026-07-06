// Retorno de falha do Mercado Pago (back_url failure).
// O carrinho NÃO é limpo aqui — o cliente volta e tenta de novo sem perder nada.

import { ButtonLink } from "@/components/ui/Button";
import Grain from "@/components/ui/Grain";

export default function PagamentoFalhouPage() {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden bg-plum-950 px-5 py-20 text-cream">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #2A0E26 0%, #1A0817 60%, #150611 100%)",
        }}
      />
      <Grain opacity={0.07} />

      <div className="relative mx-auto flex max-w-prose flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            className="h-8 w-8 text-cream/80"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>

        <h1 className="mt-6 font-display text-3xl text-cream md:text-5xl">
          Não foi possível concluir o pagamento
        </h1>

        <p className="mt-5 max-w-md font-body text-cream/70 md:text-lg">
          O pagamento não foi aprovado ou foi cancelado. Nenhum valor foi cobrado. Seus itens
          continuam no carrinho — você pode tentar novamente com outro meio de pagamento.
        </p>

        <ButtonLink href="/carrinho" className="mt-8 bg-cream text-plum-950 hover:bg-white hover:shadow-none">
          Voltar ao carrinho
        </ButtonLink>
      </div>
    </div>
  );
}
