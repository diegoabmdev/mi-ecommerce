"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  totalFavorites: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar de LocalStorage al montar
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist_storage");
    if (savedWishlist) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error cargando wishlist", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar en LocalStorage al cambiar
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("wishlist_storage", JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        // Si existe, lo quitamos
        return prev.filter((item) => item.id !== product.id);
      }
      // Si no existe, lo agregamos
      return [...prev, product];
    });
  };

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

  const clearWishlist = () => setWishlist([]);

  const totalFavorites = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist, totalFavorites }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  return context;
};