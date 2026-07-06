import { ButtonLink } from "@/components/ui/Button";

export default function EmptyCart({ onAction }: { onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="font-display text-xl text-ink">Seu carrinho está vazio</p>
      <p className="max-w-prose font-body text-ink-soft">
        Açaí de verdade, sem freezer e pronto em segundos. Comece pelo produto.
      </p>
      <ButtonLink href="/" onClick={onAction}>
        Ver o produto
      </ButtonLink>
    </div>
  );
}
