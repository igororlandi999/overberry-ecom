"use client";

// Retorno de sucesso do Mercado Pago (back_url success).
// NOTA: sem webhook (próxima fase), esta página indica que o fluxo de pagamento
// foi concluído no redirect — a confirmação final/conciliação virá pela
// notificação do Mercado Pago quando o webhook for implementado.

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { ButtonLink } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Grain from "@/components/ui/Grain";

export default function ObrigadoPage() {
  const clear = useCart((s) => s.clear);

  // Pagamento iniciado com sucesso: zera o carrinho para evitar recompra acidental.
  useEffect(() => {
    clear();
  }, [clear]);

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
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(78,154,111,0.18), transparent 70%)" }}
      />
      <Grain opacity={0.07} />

      <div className="relative mx-auto flex max-w-prose flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-green-500/15 ring-1 ring-green-500/40">
          <Icon name="check" className="h-8 w-8 text-green-500" />
        </span>

        <h1 className="mt-6 font-display text-3xl text-cream md:text-5xl">
          Pedido iniciado com sucesso
        </h1>

        <p className="mt-5 max-w-md font-body text-cream/70 md:text-lg">
          Recebemos seu pedido. Se o pagamento foi aprovado, você receberá a confirmação do
          Mercado Pago por e-mail. Pagamentos por Pix e boleto podem levar alguns instantes para
          processar.
        </p>

        <p className="mt-4 font-body text-sm text-cream/50">
          Qualquer dúvida, o atendimento é direto com a OverBerry.
        </p>

        <ButtonLink href="/" className="mt-8 bg-cream text-plum-950 hover:bg-white hover:shadow-none">
          Voltar ao início
        </ButtonLink>
      </div>
    </div>
  );
}
