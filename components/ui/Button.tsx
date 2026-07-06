import clsx from "clsx";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

// Pílula unificada: mesma linguagem do CTA do BuyBox/Kits em todo o site.
const base =
  "inline-flex items-center justify-center font-body font-semibold rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta disabled:opacity-50 disabled:pointer-events-none";

const sizes = "min-h-[52px] px-7 text-base";

const variants: Record<Variant, string> = {
  primary: "bg-purple-700 text-cream hover:bg-purple-600 hover:shadow-glow",
  secondary: "border border-purple-700 text-purple-700 hover:bg-purple-100",
  ghost: "text-purple-700 hover:bg-purple-100",
};

type CommonProps = {
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(base, sizes, variants[variant], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  fullWidth,
  className,
  children,
  href,
  ...rest
}: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={clsx(base, sizes, variants[variant], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
