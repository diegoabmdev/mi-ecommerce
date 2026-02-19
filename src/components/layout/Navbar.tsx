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
  Loader2,
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

  // Usamos nuestro hook refactorizado
  const { categories, loading, error } = useCategory();

  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState<"main" | "categories">("main");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md font-bold">
      <div className="flex h-13 lg:h-18 items-center justify-between gap-4 px-2 lg:px-10">

        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setTimeout(() => setMenuView("main"), 300);
          }}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 lg:hidden">
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
            </SheetTrigger>

            <div className="hidden lg:block">
              <SheetTrigger asChild>
                <Button variant="ghost" size="lg" className="gap-2 px-4">
                  <Menu className="h-5 w-5" />
                  <span className="font-medium text-lg">Menú</span>
                </Button>
              </SheetTrigger>
            </div>

            <SheetContent side="left" className="w-[85vw] sm:w-72 p-0" showCloseButton={false}>
              <AnimatePresence mode="wait">
                {menuView === "main" ? (
                  <motion.div
                    key="main"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                      <SheetTitle className="text-xl font-bold">¡Hola!</SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon"><X className="h-6 w-6" /></Button>
                      </SheetClose>
                    </div>

                    <ScrollArea className="flex-1 px-2">
                      <div className="flex flex-col py-4 gap-y-2">
                        <SheetClose asChild><MenuLink href="/">Inicio</MenuLink></SheetClose>
                        <SheetClose asChild><MenuLink href="/shop">Tienda</MenuLink></SheetClose>
                        <SheetClose asChild><MenuLink href="/offers">Ofertas</MenuLink></SheetClose>

                        <Separator className="my-2" />

                        <Button
                          variant="ghost"
                          className="group justify-between px-6 py-6 text-lg hover:bg-muted/70 border-l-4 border-transparent hover:border-indigo-500 transition-all"
                          onClick={() => setMenuView("categories")}
                        >
                          Categorías
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin opacity-50" />
                          ) : (
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          )}
                        </Button>
                      </div>
                    </ScrollArea>
                  </motion.div>
                ) : (
                  <motion.div
                    key="categories"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="flex flex-col h-full w-full"
                  >
                    <SheetHeader className="px-4 border-b flex flex-row items-center gap-2 h-16">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMenuView("main")}
                      >
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                      <SheetTitle className="text-lg font-bold">Categorías</SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1">
                      <div className="flex flex-col py-2">
                        {error && (
                          <p className="px-6 py-4 text-sm text-destructive">Error al cargar categorías</p>
                        )}

                        {categories.map((cat) => (
                          <SheetClose asChild key={cat.slug}>
                            <Link
                              href={`/category/${cat.slug}`}
                              className="px-8 py-4 text-base capitalize hover:bg-indigo-50 hover:text-indigo-600 border-l-4 border-transparent hover:border-indigo-500 transition-all"
                              onClick={() => setIsOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-500">
            Nova<span className="text-foreground">Cart</span>
          </Link>
        </div>

        {/* Buscador Desktop */}
        <div className="hidden lg:block lg:flex-1 lg:max-w-2xl mx-8">
          <form className="relative">
            <Input
              placeholder="Buscar en NovaCart..."
              className="h-11 pl-6 pr-14 bg-muted/50 border-none rounded-full text-base focus-visible:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Iconos Derecha */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
            <User className="h-5 w-5" />
            <div className="flex flex-col items-start text-[10px] leading-tight">
              <span className="font-normal opacity-70">Hola, identifícate</span>
              <span className="font-bold">Mi Cuenta</span>
            </div>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>

          <div className="hidden md:block h-8 w-px bg-border" />

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-6 w-6" />
              {totalFavorites > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-indigo-500">
                  {totalFavorites}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-indigo-500">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}