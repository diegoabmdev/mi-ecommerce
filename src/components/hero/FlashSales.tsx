// components/home/FlashSales.tsx
"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Timer } from "lucide-react";
import { useState, useEffect } from "react";
import Tittles from "./Tittles";

export const FlashSales = () => {
  const { products, loading } = useProducts();

  // Estado para un contador regresivo (simulado)
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtrar productos con descuento mayor al 15%
  const flashProducts = products
    .filter((p) => p.discountPercentage > 10)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 6);

  if (loading) return <FlashSalesSkeleton />;

  if (flashProducts.length === 0) return null;

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div className="flex items-end justify-between">
          <Tittles title="Relámpago" badge="Ofertas" />
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-2xl border border-indigo-100 shadow-sm">
          <Timer className="w-6 h-6 text-white" />
          <div className="flex gap-1 text-lg font-black font-mono text-white">
            <span>{String(timeLeft.h).padStart(2, "0")}</span>:
            <span>{String(timeLeft.m).padStart(2, "0")}</span>:
            <span>{String(timeLeft.s).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {flashProducts.map((product) => (
          <div key={product.id} className="relative">
            <div className="absolute -top-2 -right-2 z-20 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
              HOT
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

const FlashSalesSkeleton = () => (
  <div className="h-100 w-full bg-slate-50 animate-pulse rounded-[2.5rem]" />
);
