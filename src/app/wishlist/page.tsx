"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, ArrowLeft, Sparkles, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, totalFavorites, isInitialized, moveAllToCart } = useWishlist();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (totalFavorites === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <Heart className="h-24 w-24 text-slate-100 fill-slate-50" />
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-indigo-400 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">Tu lista está vacía</h1>
            <p className="text-slate-500 mb-8 font-medium">Guarda productos que te encantan para después.</p>
            <Link href="/products">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 w-full text-base font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                <ArrowLeft className="mr-2 h-5 w-5" /> Explorar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Cabecera con botón de acción masiva */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                Mi Lista de <span className="text-indigo-600">Deseos</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">
              Tienes {totalFavorites} artículo{totalFavorites !== 1 ? "s" : ""} guardado{totalFavorites !== 1 ? "s" : ""}.
            </p>
          </div>

          {/* Botón Mover Todo al Carrito */}
          <Button
            onClick={moveAllToCart}
            className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-6 h-14 font-bold shadow-xl transition-all flex gap-2 group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
            Mover todo al carrito
          </Button>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {wishlist.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <ProductCard product={item} />
            </motion.div>
          ))}
        </div>

        {/* Banner Inferior */}
        <div className="mt-20 bg-linear-to-r from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">¿Aún buscando el regalo perfecto?</h3>
            <p className="text-indigo-200/70 text-sm mb-8 max-w-lg mx-auto font-medium">
              Nuevos productos tecnológicos llegan cada semana. No te pierdas las últimas tendencias.
            </p>
            <Link href="/products">
              <Button className="bg-white text-slate-900 hover:bg-indigo-50 rounded-full px-10 h-12 font-black uppercase text-xs tracking-widest">
                Ver Novedades
              </Button>
            </Link>
          </div>
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        </div>
      </div>
    </div>
  );
}