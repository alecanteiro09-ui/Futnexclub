import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UtmCapture } from "@/components/whatsapp/UtmCapture";
import { CartProvider } from "@/components/cart/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Futnex Club | Seu time. Seu nome. Sua camisa.",
    template: "%s | Futnex Club",
  },
  description:
    "Catálogo digital de camisas de futebol modelo torcedor com personalização de nome e número. Escolha seu time, monte seu kit e finalize pelo WhatsApp.",
  openGraph: {
    title: "Futnex Club",
    description: "Seu time. Seu nome. Sua camisa.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-base font-sans text-ink">
        <UtmCapture />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
