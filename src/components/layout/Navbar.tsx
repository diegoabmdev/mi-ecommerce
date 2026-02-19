"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  ChevronRight,
  ArrowLeft,
  X,
  ChevronDown,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuLink } from "./MenuLinkt";
import { useCategory } from "@/hooks/useCategory";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Separator } from "../ui/separator";

export default function Navbar() {
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();
  const { categories, loading, error } = useCategory();

  // Estado para controlar el Sheet y qué vista mostrar
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<"main" | "categories">("main");

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <span className="text-2xl font-bold">NovaCart</span>
          <div>Cargando...</div>
        </div>
      </header>
    );
  }

  if (error) {
    return <div className="text-destructive text-center py-4">Error: {error}</div>;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md font-bold">
      <div className="flex h-13 lg:h-18 items-center justify-between gap-4 px-2 lg:px-10">

        <div className="flex items-center gap-4">
          {/* Sheet para todo el menú (Mobile + Desktop) */}
          <Sheet open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setTimeout(() => setMenuView("main"), 300); // Reset al cerrar
          }}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 lg:hidden">
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
            </SheetTrigger>

            {/* Desktop Menu Trigger */}
            <div className="hidden lg:block">
              <SheetTrigger asChild>
                <Button variant="ghost" size="lg" className="gap-2 px-4">
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                  <span className="font-medium text-lg">Menú</span>
                </Button>
              </SheetTrigger>
            </div>

            <SheetContent side="left" className="w-[85vw] sm:w-72 p-0" showCloseButton={false}>
              <AnimatePresence mode="wait">
                {menuView === "main" ? (
                  /* VISTA PRINCIPAL */
                  <div className="flex flex-col h-full">
                    <div className="px-6 py-4 border-b flex items-center justify-between lg:px-7">
                      <SheetTitle className="text-xl font-bold lg:text-lg">¡Hola!</SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                          <X className="h-6 w-6" />
                        </Button>
                      </SheetClose>
                    </div>

                    <ScrollArea className="flex-1 px-2">
                      <div className="flex flex-col py-4 gap-y-4">
                        <SheetClose asChild><MenuLink href="/">Inicio</MenuLink></SheetClose>
                        <SheetClose asChild><MenuLink href="/shop">Tienda</MenuLink></SheetClose>
                        <SheetClose asChild><MenuLink href="/offers">Ofertas</MenuLink></SheetClose>

                        <Separator />
                        <Button
                          variant="ghost"
                          className="mt-4 group justify-between px-6 py-4 text-lg hover:bg-muted/70 hover:border-l-[6px] hover:border-indigo-500 lg:py-8"
                          onClick={() => setMenuView("categories")}
                        >
                          Categorías
                          <ChevronRight className="ml-auto h-5 w-5 transition-all group-hover:text-indigo-500 group-hover:scale-110" />
                        </Button>
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  /* VISTA CATEGORÍAS */
                  <div className="flex flex-col h-full w-full">
                    <SheetHeader className="px-2 border-b flex flex-row items-center gap-0 h-16.25">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-muted/50 transition-colors"
                        onClick={() => setMenuView("main")}
                      >
                        <ArrowLeft className="h-6 w-6" />
                        <span className="sr-only">Volver</span>
                      </Button>
                      <SheetTitle className="text-lg font-bold">Categorías</SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="h-[calc(100vh-65px)] w-full">
                      <div className="flex flex-col py-4 pb-10">
                        {categories.map((cat) => (
                          <SheetClose asChild key={cat.slug}>
                            <Link
                              href={`/category/${cat.slug}`}
                              className="mx-2 px-6 py-4 text-lg hover:font-medium rounded-md hover:border-l-[6px] hover:border-indigo-500 capitalize transition-all"
                              onClick={() => setIsOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </AnimatePresence>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-500">
            Nova<span>Cart.com</span>
          </Link>
        </div>

        {/* Buscador Desktop */}
        <div className="hidden lg:block lg:flex-1 lg:max-w-4xl mx-8">
          <form className="relative">
            <Input
              placeholder="Buscar en NovaCart.com"
              className="h-12 pl-6 pr-14 bg-muted/60 border border-input/50 rounded-full text-base shadow-sm"
            />
            <button
              type="submit"
              className="flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-indigo-500 hover:bg-indigo-500/90 text-white shadow-md transition-all duration-200 cursor-pointer"
            >
              <Search className="h-6 w-6" />
            </button>
          </form>
        </div>

        {/* Derecha: Iconos y User */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium leading-none">Hola, Iniciar sesión</span>
            <ChevronDown className="h-6 w-6" />
          </Button>

          <div className="hidden md:block h-10 w-px bg-gray-200 self-center" />

          <Button variant="ghost" size="icon" className="relative h-10 w-10">
            <Link href="/wishlist">
              <Heart className="h-7 w-7" />
              {totalFavorites > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-6 min-w-6 text-xs flex items-center justify-center">
                  {totalFavorites}
                </Badge>
              )}
            </Link>
          </Button>

          <div className="hidden md:block h-10 w-px bg-gray-200 self-center" />

          <Button variant="ghost" size="icon" className="relative h-10 w-10">
            <Link href="/cart">
              <ShoppingCart className="h-7 w-7" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-6 min-w-6 text-xs flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div >
    </header >
  );
}