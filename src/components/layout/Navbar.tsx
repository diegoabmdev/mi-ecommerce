"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
import { Separator } from "../ui/separator";
import { MenuLink } from "./MenuLinkt";
import { useMenuState } from "@/hooks/useMenuState";
import { useCategories } from "@/hooks/useCategory";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { cartCount, wishlistCount } = useCartStore();
  const { categories, loading, error } = useCategories();
  const {
    mainOpen,
    setMainOpen,
    categoriesOpen,
    setCategoriesOpen,
    openCategories,
    closeCategoriesAndOpenMain,
  } = useMenuState();

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
    return (
      <div className="text-destructive text-center py-4">Error: {error}</div>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md font-bold">
      <div className="flex h-13 lg:h-18 items-center justify-between gap-4 px-2 lg:px-10">
        {/* Izquierda: Hamburguesa mobile + Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburguesa solo mobile */}
          <div className="lg:hidden">
            <Sheet open={mainOpen} onOpenChange={setMainOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                  <motion.div
                    animate={{ rotate: mainOpen ? 90 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {mainOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </motion.div>
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[85vw] sm:w-72 p-0" showCloseButton={false}>
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <SheetTitle className="text-xl font-bold">¡Hola!</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                </div>

                <ScrollArea className="h-[calc(100vh-140px)] px-2">
                  <div className="flex flex-col py-4">
                    <SheetClose asChild><MenuLink href="/">Inicio</MenuLink></SheetClose>
                    <SheetClose asChild><MenuLink href="/shop">Tienda</MenuLink></SheetClose>
                    <SheetClose asChild><MenuLink href="/offers">Ofertas</MenuLink></SheetClose>

                    <Button
                      variant="ghost"
                      className="group justify-start px-6 py-4 text-lg hover:bg-muted/70 hover:border-l-6 hover:border-indigo-500"
                      onClick={openCategories}
                    >
                      Categorías
                      <ChevronRight className="ml-auto h-5 w-5 transition-all group-hover:text-indigo-500 group-hover:scale-110" />
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo (siempre visible) */}
          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-500">
            Nova<span>Cart.com</span>
          </Link>
        </div>

        {/*Menu principal desktop*/}
        <div className="hidden lg:flex items-center gap-6">
          <Sheet open={mainOpen} onOpenChange={setMainOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="lg" className="gap-2 px-4">
                <motion.div
                  animate={{ rotate: mainOpen ? 90 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {mainOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
                <span className="font-medium text-lg">Menú</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[85vw] sm:w-72 p-0" showCloseButton={false}>
              <Separator
                className="border-indigo-500 border-t-4"
                orientation="horizontal"
              />
              <div className="px-7 py-0 relative flex items-center justify-between w-full">
                <SheetTitle className="text-lg font-bold absolute">
                  ¡Hola!
                </SheetTitle>

                <SheetClose asChild className="ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted/50"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Cerrar menú</span>
                  </Button>
                </SheetClose>
              </div>
              <Separator orientation="horizontal" />
              <ScrollArea className="h-[calc(100vh-140px)] px-2">
                <div className="flex flex-col py-4">
                  <SheetClose asChild>
                    <MenuLink href="/">Inicio</MenuLink>
                  </SheetClose>

                  <SheetClose asChild>
                    <MenuLink href="/shop">Tienda</MenuLink>
                  </SheetClose>

                  <SheetClose asChild>
                    <MenuLink href="/offers">Ofertas</MenuLink>
                  </SheetClose>

                  <Button
                    variant="ghost"
                    size="lg"
                    className="group justify-start hover:font-medium rounded-md hover:border-l-6 hover:border-indigo-500"
                    onClick={() => {
                      setMainOpen(false);
                      setTimeout(() => setCategoriesOpen(true), 300);
                    }}
                  >
                    Categorías
                    <ChevronRight className="ml-auto w-6 h-6 group-hover:text-indigo-500" />
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Buscador centrado desktop */}
        <div className="hidden lg:block lg:flex-1 lg:max-w-4xl mx-8">
          <form className="relative">
            <Input
              placeholder="Buscar en NovaCart.com"
              className="h-12 pl-6 pr-14 bg-muted/60 border border-input/50 rounded-full text-base shadow-sm"
            />
            {/* Botón lupa*/}
            <button
              type="submit"
              className="flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-indigo-500 hover:bg-indigo-500/90 text-white shadow-md transition-all duration-200 cursor-pointer"
            >
              <Search className="h-6 w-6" />
            </button>
          </form>
        </div>

        {/* Derecha: usuario + wishlist + carrito */}
        <div className="flex items-center gap-2">
          {/* Usuario */}
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium leading-none">Hola, Iniciar sesión</span>
            <ChevronDown className="h-6 w-6" />
          </Button>

          <div className="hidden md:block h-10 w-px bg-gray-200 self-center" />

          {/* Perfil */}
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium leading-none">Mi cuenta</span>
          </Button>

          <div className="hidden md:block h-10 w-px bg-gray-200 self-center" />

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative h-10 w-10">
            <Link href="/wishlist">
              <Heart className="h-7 w-7" />
              {wishlistCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 min-w-6 text-xs flex items-center justify-center"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          <div className="hidden md:block h-10 w-px bg-gray-200 self-center" />

          {/*carrito*/}
          <Button variant="ghost" size="icon" className="relative h-10 w-10">
            <Link href="/cart">
              <ShoppingCart className="h-7 w-7" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 min-w-6 text-xs flex items-center justify-center"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/*Sub menu Categorias*/}
      <Sheet open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <SheetContent side="left" className="w-[85vw] sm:w-72 p-0" showCloseButton={false}>
          <Separator className="border-indigo-500 border-t-4" orientation="horizontal" />

          <SheetHeader className="px-2 border-b flex flex-row items-center gap-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-muted/50 transition-colors"
              onClick={closeCategoriesAndOpenMain}
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Volver al menú principal</span>
            </Button>

            <SheetTitle className="text-lg font-bold">Categorías</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-140px)] px-2">
            <div className="flex flex-col py-4">
              {categories.map((cat) => (
                <SheetClose asChild key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="px-4 py-4 text-lg hover:font-medium rounded-md hover:border-l-6 hover:border-indigo-500 capitalize"
                    onClick={() => {
                      setCategoriesOpen(false);
                      setMainOpen(false);
                    }}
                  >
                    {cat.name}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}
