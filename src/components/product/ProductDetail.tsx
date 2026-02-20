"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/types";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";
import Link from "next/link";
import { FeaturedProductsGrid } from "./FeaturedProductsGrid";

interface Props {
  product: Product;
}

export default function ProductDetailPage({ product }: Props) {
  // 1. Hooks de Contexto (Siempre al inicio)
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // 2. Estado de Imagen (Inicializado con la prop para evitar useEffects innecesarios)
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || product?.thumbnail || ""
  );

  // 3. Validación de datos (Si no hay producto, mostramos un loader)
  if (!product || !product.images) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 4. Lógica de Negocio
  const priceCLP = convertUSDtoCLP(product.price);
  const isFavorite = isInWishlist(product.id);
  const oldPrice = priceCLP / (1 - product.discountPercentage / 100);

  return (
    <div className="max-w-340 min-h-screen bg-white pb-20 mx-auto">
      {/* Breadcrumbs / Navegación */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-indigo-600 transition-colors">Productos</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 truncate max-w-37.5">{product.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">

          {/* COLUMNA IZQUIERDA: VISUALES */}
          <div className="space-y-6">
            <motion.div
              layoutId={`image-${product.id}`}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={selectedImage}
                    alt={product.title}
                    fill
                    className="object-contain p-12"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {product.discountPercentage > 0 && (
                <div className="absolute top-8 left-8 bg-indigo-600 text-white px-5 py-2 rounded-2xl font-black text-sm italic shadow-lg shadow-indigo-200">
                  -{Math.round(product.discountPercentage)}% OFF
                </div>
              )}
            </motion.div>

            {/* Selector de Miniaturas */}
            <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 p-2 bg-slate-50 ${selectedImage === img
                    ? "border-indigo-600 shadow-xl shadow-indigo-100 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`${product.title} view ${i}`} fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO COMPRA */}
          <div className="flex flex-col justify-center">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black uppercase tracking-tighter text-[10px] px-3 py-1">
                  {product.category}
                </Badge>
                <div className="flex items-center text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9] mb-6">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {formatCLP(priceCLP)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-xl text-slate-400 line-through font-bold">
                    {formatCLP(oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-slate-500 leading-relaxed font-medium text-lg max-w-xl">
                {product.description}
              </p>
            </div>

            {/* ACCIONES DE COMPRA */}
            <div className="space-y-6 mb-12">
              <div className="flex flex-row gap-4">
                <Button
                  onClick={() => addToCart(product)}
                  className="flex-1 h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] text-xl font-black uppercase tracking-tighter shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Añadir al Carrito
                </Button>

                <Button
                  onClick={() => toggleWishlist(product)}
                  variant="outline"
                  className={`h-20 w-20 rounded-[1.5rem] border-slate-200 transition-all ${isFavorite
                    ? "bg-rose-50 border-rose-100 text-rose-500 shadow-lg shadow-rose-100"
                    : "text-slate-300 hover:text-indigo-600 hover:border-indigo-200"
                    }`}
                >
                  <Heart className={`h-8 w-8 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-3 rounded-xl">
                <CheckCircle2 className="h-4 w-4" />
                Producto disponible para envío inmediato ({product.stock} unidades)
              </div>
            </div>

            {/* INFO EXTRA (BENTO CARDS) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <Truck className="h-6 w-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Envío Gratis</h4>
                <p className="text-xs text-slate-500">En compras sobre $50.000</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <ShieldCheck className="h-6 w-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Protección Compra</h4>
                <p className="text-xs text-slate-500">12 meses de garantía tech</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <section className="mt-20 border-t border-slate-100 pt-16 mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Especificaciones Técnicas (Bento Style) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-6">
                Especificaciones <span className="text-indigo-600">Técnicas</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Marca", value: product.brand },
                  { label: "SKU", value: product.sku },
                  { label: "Peso", value: `${product.weight}g` },
                  { label: "Dimensiones", value: `${product.dimensions.width} x ${product.dimensions.height} cm` },
                  { label: "Garantía", value: product.warrantyInformation },
                  { label: "Devolución", value: product.returnPolicy },
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-bold text-sm uppercase">{spec.label}</span>
                    <span className="text-slate-900 font-black text-sm">{spec.value || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reseñas de Clientes */}
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-6">
                Lo que dicen los <span className="text-indigo-600">Expertos</span>
              </h3>
              <div className="space-y-4">
                {product.reviews.map((review, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-orange-400">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <Star key={star} className={`w-3 h-3 ${star < review.rating ? "fill-current" : "text-slate-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase italic">{review.reviewerName}</span>
                    </div>
                    <p className="text-slate-600 text-sm italic font-medium">{review.comment}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar de Confianza Tech */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 bg-white rounded-[2.5rem] text-black overflow-hidden shadow-xl">
              <Zap className="absolute -right-4 -top-4 w-32 h-32 text-indigo-500/10 rotate-12" />
              <h4 className="text-xl font-black uppercase italic mb-6 leading-tight">
                ¿Por qué comprar en <span className="text-indigo-400">Indigo Shop?</span>
              </h4>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-indigo-400 w-5 h-5" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">Autenticidad 100% garantizada en cada pieza.</p>
                </li>
                <li className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Truck className="text-indigo-400 w-5 h-5" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">Soporte técnico especializado post-venta.</p>
                </li>
              </ul>
              <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic py-6 rounded-2xl">
                Saber más
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN RELACIONADOS */}
      <div className="px-4 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Productos <span className="text-indigo-600">Relacionados</span>
          </h3>
        </div>
        <FeaturedProductsGrid limit={6} category={product.category} />
      </div>
    </div>
  );
}