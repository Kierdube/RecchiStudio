import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import { CartProvider } from "@/contexts/CartContext";

import "./globals.css";
import { defaultOpenGraph, siteUrl } from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fdfcf8",
};

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Recchi Studio — Express yourself with cute and nature-inspired patterns",
    template: "%s | Recchi Studio",
  },
  description:
    "Cute, nature-inspired patterns — express yourself with what you wear. Browse the catalog for tees, crop tops, and more.",
  openGraph: {
    ...defaultOpenGraph(),
    title: "Recchi Studio",
    description:
      "Cute, nature-inspired apparel — express yourself with what you wear. Browse tees, crop tops, and more.",
    url: siteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Recchi Studio",
    description:
      "Cute, nature-inspired apparel — express yourself with what you wear.",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full min-h-[100dvh] flex-col overflow-x-hidden bg-[#FDFCF8] font-sans text-[#19371E] antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
