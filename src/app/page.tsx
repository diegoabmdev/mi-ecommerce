"use client";

import { FeaturedProducts } from "@/components/hero/HeroSection";
import { FeaturedProductsGrid } from "@/components/product/FeaturedProductsGrid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white py-16 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a NovaCart
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Descubre miles de productos con descuentos increíbles
          </p>
          <Button size="lg" variant="secondary" className="mt-8">
            Explorar ahora
          </Button>
        </div>
      </div>
      <FeaturedProducts>
        <FeaturedProductsGrid />
      </FeaturedProducts>
    </div>
  );
}