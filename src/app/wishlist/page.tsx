// src/app/wishlist/page.tsx
"use client";

import { Product, useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCartStore();

  const handleMoveToCart = (item: Product) => {
    addToCart(item);
    removeFromWishlist(item.id);
    toast.success("Producto movido al carrito");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Lista de deseos</h1>
        <p className="text-muted-foreground mb-8">Tu lista de deseos está vacía</p>
        <Button asChild>
          <Link href="/">Explorar productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Lista de deseos ({wishlistItems.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="relative aspect-square">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <p className="text-lg font-bold mt-2">
                ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${item.price.toFixed(2)}
                </span>
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  removeFromWishlist(item.id);
                  toast.success("Eliminado de la lista de deseos");
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleMoveToCart(item)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Al carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}