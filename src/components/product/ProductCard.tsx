"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/types";
import { useCart } from "@/context/CartContext";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const currentPriceCLP = convertUSDtoCLP(product.price);
  const originalPriceCLP =
    product.discountPercentage > 0
      ? Math.round(currentPriceCLP / (1 - product.discountPercentage / 100))
      : currentPriceCLP;

  const isFavorite = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e?.preventDefault?.();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e?.preventDefault?.();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Discount Badge */}
      {product.discountPercentage > 5 && (
        <Badge className="absolute left-3 top-3 z-10 bg-accent text-accent-foreground">
          -{Math.round(product.discountPercentage)}%
        </Badge>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand || product.category}
        </p>

        <div className="hover:text-accent transition-colors">
          <h3 className="line-clamp-1 text-sm font-semibold text-card-foreground">
            {product.title}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-muted-foreground">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews.length})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span
            className={`text-base font-bold ${product.discountPercentage > 15 ? "text-indigo-600" : "text-card-foreground"}`}
          >
            {formatCLP(currentPriceCLP)}
          </span>
          {product.discountPercentage > 5 && (
            <span className="text-sm text-muted-foreground line-through decoration-indigo-400/50">
              {formatCLP(originalPriceCLP)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5"
          onClick={handleAddToCartClick}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>
    </Link>
  );
}
