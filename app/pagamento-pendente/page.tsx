// Retorno de pagamento pendente do Mercado Pago (back_url pending).
// Típico de Pix aguardando pagamento ou boleto emitido.

import { ButtonLink } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Grain from "@/components/ui/Grain";

export default function PagamentoPendentePage() {
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
        style={{ background: "radial-gradient(circle, rgba(184,58,130,0.16), transparent 70%)" }}
      />
      <Grain opacity={0.07} />

      <div className="relative mx-auto flex max-w-prose flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-magenta/15 ring-1 ring-magenta/40">
          <Icon name="clock" className="h-8 w-8 text-magenta" />
        </span>

        <h1 className="mt-6 font-display text-3xl text-cream md:text-5xl">
          Pagamento em processamento
        </h1>

        <p className="mt-5 max-w-md font-body text-cream/70 md:text-lg">
          Seu pagamento está pendente de confirmação. Se você pagou por Pix, a aprovação costuma
          levar poucos minutos. Boletos podem levar até 2 dias úteis para compensar.
        </p>

        <p className="mt-4 font-body text-sm text-cream/50">
          Assim que o Mercado Pago confirmar, você recebe a atualização por e-mail.
        </p>

        <ButtonLink href="/" className="mt-8 bg-cream text-plum-950 hover:bg-white hover:shadow-none">
          Voltar ao início
        </ButtonLink>
      </div>
    </div>
  );
}
