import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import "./globals.css";

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
  title: {
    default: "Recchi Studio — Express yourself with cute and nature-inspired patterns",
    template: "%s | Recchi Studio",
  },
  description:
    "Cute, nature-inspired patterns — express yourself with what you wear. Browse the catalog for tees, crop tops, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full min-h-[100dvh] flex-col overflow-x-hidden bg-[#FDFCF8] font-sans text-[#19371E] antialiased">
        {children}
      </body>
    </html>
  );
}
