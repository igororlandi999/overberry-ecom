import clsx from "clsx";
import Grain from "@/components/ui/Grain";

type Bg = "cream" | "white" | "dark" | "accent";

const bgMap: Record<Bg, string> = {
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
  dark: "bg-plum-950 text-cream",
  accent: "bg-purple-100 text-ink",
};

export default function Section({
  bg = "cream",
  id,
  className,
  grain = false,
  glow = false,
  children,
}: {
  bg?: Bg;
  id?: string;
  className?: string;
  grain?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}) {
  const dark = bg === "dark";
  return (
    <section
      id={id}
      className={clsx("relative overflow-hidden px-5 py-14 md:py-24 scroll-mt-20", bgMap[bg], className)}
    >
      {dark && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 70% 10%, #2A0E26 0%, #1A0817 60%, #150611 100%)" }}
        />
      )}
      {glow && (
        <div
          aria-hidden="true"
          className="absolute -right-24 top-1/4 h-[46vh] w-[46vh] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(184,58,130,0.20), transparent 70%)" }}
        />
      )}
      {grain && <Grain opacity={dark ? 0.08 : 0.05} />}
      <div className="relative mx-auto max-w-content">{children}</div>
    </section>
  );
}
