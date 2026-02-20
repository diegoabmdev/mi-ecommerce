import { ArrowLeft, ChevronRight, LayoutGrid, Loader2, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Category, NavLink } from "@/types/types"

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  menuView: "main" | "categories";
  setMenuView: (view: "main" | "categories") => void;
  categories: Category[];
  loading: boolean;
  navLinks: NavLink[];
}

export const MobileMenu = ({
  isOpen,
  setIsOpen,
  menuView,
  setMenuView,
  categories,
  loading,
  navLinks,
}: MobileMenuProps) => (
  <Sheet
    open={isOpen}
    onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setTimeout(() => setMenuView("main"), 300);
    }}
  >
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-xl bg-muted/40 h-10 w-10"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent
      side="left"
      className="w-[85vw] sm:w-80 p-0 overflow-hidden"
      showCloseButton={false}
    >
      <AnimatePresence mode="wait">
        {menuView === "main" ? (
          <motion.div
            key="main"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex flex-col h-full"
          >
            <div className="px-6 py-6 border-b flex items-center justify-between bg-indigo-600 text-white">
              <SheetTitle className="text-2xl font-black text-white">
                NovaCart
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>
            <ScrollArea className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {navLinks.map((link: NavLink) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-bold hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <span className="p-2 bg-muted rounded-lg">
                        {link.icon}
                      </span>{" "}
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
                <Separator className="my-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-between px-4 py-8 text-lg font-bold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  onClick={() => setMenuView("categories")}
                >
                  <div className="flex items-center gap-4 ">
                    <LayoutGrid className="w-4 h-4" /> Categorías
                  </div>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ChevronRight />
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
            className="flex flex-col h-full"
          >
            <div className="px-4 py-6 border-b flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuView("main")}
              >
                <ArrowLeft />
              </Button>
              <SheetTitle className="text-xl font-bold">Categorías</SheetTitle>
            </div>
            <ScrollArea className="flex-1 p-2 pb-12 w-full h-full">
              {categories.map((cat: Category) => (
                <SheetClose asChild key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center justify-between px-6 py-4 capitalize font-semibold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  >
                    {cat.name} <ChevronRight className="opacity-30" />
                  </Link>
                </SheetClose>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </SheetContent>
  </Sheet>
);
