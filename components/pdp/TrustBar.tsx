import Grain from "@/components/ui/Grain";
import Icon from "@/components/ui/Icon";
import { trustItems } from "@/lib/content";

export default function TrustBar() {
  return (
    <section className="relative overflow-hidden bg-plum-900 px-5 py-8 text-cream">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#1A0817 0%,#22091F 100%)" }}
      />
      <Grain opacity={0.06} />
      <ul className="relative mx-auto grid max-w-content grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
        {trustItems.map((item) => (
          <li key={item.label} className="flex items-center gap-3 md:justify-center md:px-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-magenta ring-1 ring-white/15">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <span className="font-body text-sm leading-tight text-cream/85">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
