import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Açaí Liofilizado em Pó 100g | OverBerry",
  description:
    "Açaí de verdade, sem freezer e pronto em segundos. Açaí liofilizado 100% natural do Norte do Brasil, sem açúcar adicionado. Até 20 porções por pacote.",
  openGraph: {
    title: "Açaí Liofilizado em Pó 100g | OverBerry",
    description:
      "Açaí de verdade, sem freezer e pronto em segundos. 100% natural, sem açúcar adicionado.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
