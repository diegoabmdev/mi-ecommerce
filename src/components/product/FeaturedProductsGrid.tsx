"use client"

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "../product/ProductCard";
import { Skeleton } from "../ui/skeleton";

// components/product/FeaturedProductsGrid.tsx
export function FeaturedProductsGrid({
  limit,
  category,
}: {
  limit?: number;
  category?: string;
}) {
  const { products, loading, error } = useProducts();

  // Lógica de filtrado
  const displayedProducts = products
    .filter((p) => !category || p.category === category)
    .slice(0, limit || products.length);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
