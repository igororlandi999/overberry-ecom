import clsx from "clsx";

type Tone = "default" | "highlight" | "natural";

const tones: Record<Tone, string> = {
  default: "bg-white text-ink-soft border border-line",
  highlight: "bg-purple-700 text-cream",
  natural: "bg-green-100 text-green-700",
};

export default function Badge({
  tone = "default",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "eyebrow inline-flex items-center rounded-sm px-2.5 py-1",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
