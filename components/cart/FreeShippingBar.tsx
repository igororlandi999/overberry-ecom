import { brl } from "@/lib/format";
import {
  FREE_SHIPPING_THRESHOLD,
  isFreeShipping,
  missingForFreeShipping,
} from "@/lib/shipping";

type FreeShippingBarProps = {
  subtotal: number;
};

export default function FreeShippingBar({ subtotal }: FreeShippingBarProps) {
  const free = isFreeShipping(subtotal);
  const missing = missingForFreeShipping(subtotal);

  const progress = Math.min(
    100,
    Math.max(0, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-body text-sm text-ink-soft">
          {free ? (
            <span className="font-semibold text-green-700">
              Frete grátis liberado
            </span>
          ) : (
            <>
              Faltam{" "}
              <span className="font-semibold text-purple-700">
                {brl(missing)}
              </span>{" "}
              para frete grátis
            </>
          )}
        </p>

        {free && (
          <span className="rounded-full bg-green-100 px-2.5 py-1 font-body text-xs font-semibold text-green-700">
            Grátis
          </span>
        )}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-purple-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            free
              ? "bg-green-500"
              : "bg-gradient-to-r from-magenta to-purple-700"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}