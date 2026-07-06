import Image from "next/image";
import Link from "next/link";
import CartCount from "./CartCount";

const nav = [
  { href: "#como-usar", label: "Modo de uso" },
  { href: "#economia", label: "Economia" },
  { href: "#kits", label: "Kits" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label="OverBerry — início" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="OverBerry"
            width={786}
            height={194}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <nav aria-label="Seções" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm font-body text-sm text-ink-soft transition-colors hover:text-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <CartCount />
      </div>
    </header>
  );
}
