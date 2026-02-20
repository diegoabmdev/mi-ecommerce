"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    subtitle: "Titanio. Tan fuerte. Tan ligero.",
    image:
      "https://images.unsplash.com/photo-1695619575474-9b45e37bc1e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "from-slate-900 to-slate-800",
    link: "/products?category=smartphones",
  },
  {
    id: 2,
    title: "MacBook Air M3",
    subtitle: "Potencia para llevar a todos lados.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    color: "from-indigo-900 to-blue-900",
    link: "/products?category=laptops",
  },
  {
    id: 3,
    title: "Audio Premium",
    subtitle: "Sumérgete en un sonido sin límites.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    color: "from-purple-900 to-indigo-950",
    link: "/products",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent(current === SLIDES.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? SLIDES.length - 1 : current - 1);

  return (
    <section className="relative h-112.5 md:h-125 w-full overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-linear-to-br ${SLIDES[current].color}`}
        >
          {/* Imagen de fondo con Overlay */}
          <div className="absolute inset-0">
            <Image
              src={SLIDES[current].image}
              alt={SLIDES[current].title}
              width={1000}
              height={1000}
              className="h-full w-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent" />
          </div>

          {/* Contenido */}
          <div className="container relative z-10 mx-auto flex h-full items-center px-6 lg:px-12">
            <div className="max-w-2xl space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400">
                  Destacado de la semana
                </span>
                <h1 className="mt-2 text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                  {SLIDES[current].title}
                </h1>
                <p className="mt-4 text-lg text-slate-300 max-w-md">
                  {SLIDES[current].subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <Link
                  href={SLIDES[current].link}
                  className="group flex items-center gap-2 bg-white px-8 py-4 rounded-full text-black font-bold hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
                >
                  Explorar Ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles de Navegación */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white hover:text-black backdrop-blur-md"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white hover:text-black backdrop-blur-md"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicadores (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all rounded-full ${
              current === i
                ? "w-8 bg-indigo-500"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
