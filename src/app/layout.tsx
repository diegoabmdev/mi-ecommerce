// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaCart – Tu tienda moderna",
  description:
    "Proyecto portafolio e-commerce con Next.js, Zustand y DummyJSON",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <WishlistProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <Suspense
                fallback={<div className="h-20 w-full bg-background" />}
              >
                <Navbar />
              </Suspense>

              <main className="flex-1">
                <Suspense fallback={null}>{children}</Suspense>
              </main>

              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} Diego – Portafolio E-commerce
                  </p>
                </div>
              </footer>
            </div>
          </CartProvider>
        </WishlistProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
