"use client";

export default function QuantityStepper({
  qty,
  onChange,
  size = "md",
}: {
  qty: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg";
  return (
    <div className="inline-flex items-center rounded-md border border-line">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => onChange(qty - 1)}
        className={`${dim} flex items-center justify-center text-purple-700 hover:bg-purple-100 disabled:opacity-40`}
      >
        −
      </button>
      <span className="min-w-[2ch] text-center font-body text-sm font-semibold tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(qty + 1)}
        className={`${dim} flex items-center justify-center text-purple-700 hover:bg-purple-100`}
      >
        +
      </button>
    </div>
  );
}
