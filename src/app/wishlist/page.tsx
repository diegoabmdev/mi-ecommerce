// src/app/wishlist/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, totalFavorites, isInWishlist } = useWishlist();

  if (!isInWishlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB4444]"></div>
      </div>
    );
  }

  if (totalFavorites === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu lista de deseos está vacía</h1>
          <p className="text-gray-600 mb-6">Guarda productos para comprarlos más tarde</p>
          <Link href="/products">
            <Button className="bg-[#DB4444] hover:bg-[#c43d3d]">
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Lista de Deseos</h1>
          <p className="text-gray-600">{totalFavorites !== 1 ? `${totalFavorites} productos guardados` : "1 producto guardado"}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}