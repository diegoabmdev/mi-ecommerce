// src/store/cartStore.ts
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

interface CartState {
  // Carrito
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Wishlist
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product: Product) => {
        if (product.stock <= 0) {
          toast.error("Producto sin stock disponible");
          return;
        }

        set((state) => {
          const existing = state.cartItems.find(
            (item) => item.id === product.id,
          );
          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }],
          };
        });
      },
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        })),
      clearCart: () => set({ cartItems: [] }),

      // Getters
      get cartCount() {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },
      get cartTotal() {
        return get().cartItems.reduce(
          (sum, item) =>
            sum +
            item.price * (1 - item.discountPercentage / 100) * item.quantity,
          0,
        );
      },

      // Wishlist
      wishlistItems: [],
      addToWishlist: (product) =>
        set((state) => {
          if (state.wishlistItems.some((item) => item.id === product.id)) {
            return state;
          }
          return {
            wishlistItems: [...state.wishlistItems, product],
          };
        }),
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.id !== id),
        })),
      clearWishlist: () => set({ wishlistItems: [] }),

      get wishlistCount() {
        return get().wishlistItems.length;
      },
    }),
    {
      name: "novacart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
      }),
    },
  ),
);
