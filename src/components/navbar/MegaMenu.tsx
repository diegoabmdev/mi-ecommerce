"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Loader2,
  Package,
  Sparkles
} from "lucide-react";
import { Button } from "../ui/button";
import { Category } from "@/types/types";

interface MegaMenuProps {
  categories: Category[];
  loading: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

export const MegaMenu = ({
  categories,
  loading,
  isHovered,
  setIsHovered
}: MegaMenuProps) => {
  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        className={`h-full rounded-none border-b-2 transition-all font-black gap-2 px-6 ${isHovered
          ? "border-indigo-600 bg-indigo-50/50 text-indigo-600"
          : "border-transparent text-foreground/70"
          }`}
      >
        <LayoutGrid className="w-4 h-4" />
        Categorías
        <ChevronDown className={`w-3 h-3 transition-transform ${isHovered ? "rotate-180" : ""}`} />
      </Button>

      <AnimatePresence>
        {isHovered && (
          <>
            {/* Overlay de fondo para dar profundidad */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-36.25 bg-black/20 backdrop-blur-sm z-50 pointer-events-none"
            />

            {/* Panel del Menú */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-200 bg-white border border-gray-100 shadow-2xl rounded-b-[2.5rem] z-60 overflow-hidden flex flex-col"
            >
              <div className="flex">
                {/* Lado Izquierdo: Lista de Categorías */}
                <div className="w-1/2 p-8 border-r border-gray-50">
                  <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Explorar
                  </p>

                  <div className="grid grid-cols-1 gap-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      </div>
                    ) : (
                      categories.slice(0, 8).map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.slug}`}
                          className="group flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-bold text-gray-700 hover:text-indigo-600 capitalize"
                        >
                          {cat.name}
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                {/* Lado Derecho: Banner Promocional */}
                <div className="w-1/2 p-8 bg-gray-50/50 flex flex-col gap-4">
                  <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-6 text-white h-full flex flex-col justify-end group">
                    <div className="relative z-10">
                      <h4 className="text-xl font-black leading-tight">
                        Nueva Colección <br /> Tech 2026
                      </h4>
                      <Button
                        size="sm"
                        className="mt-4 bg-white text-indigo-600 hover:bg-gray-100 rounded-full font-bold"
                      >
                        Ver Catálogo
                      </Button>
                    </div>
                    {/* Icono decorativo de fondo */}
                    <Package className="absolute -right-4 -top-4 w-32 h-32 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Pie del Mega Menú */}
              <div className="bg-indigo-600 py-3 text-center text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">
                Envío gratis por compras sobre $50.000
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};