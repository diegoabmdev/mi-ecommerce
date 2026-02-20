"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, Zap, Package, Tag } from "lucide-react";

// Hooks y Contextos
import { useCategory } from "@/hooks/useCategory";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// Componentes Refactorizados
import { AnnouncementBar } from "@/components/navbar/AnnouncementBar";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { MegaMenu } from "@/components/navbar/MegaMenu";
import { SearchInput } from "@/components/navbar/SearchInput";
import { NavBadgeIcon } from "@/components/navbar/NavBadgeIcon";
import { DesktopLinks } from "@/components/navbar/DesktopLinks";
import { Logo } from "@/components/navbar/LogoNavbar";
import { SupportLinks } from "@/components/navbar/SupportLinks";

// Tipos
export interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();
  const { categories, loading } = useCategory();

  // Estados de UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState<"main" | "categories">("main");

  const navLinks: NavLink[] = [
    { name: "Inicio", href: "/", icon: <Zap className="w-4 h-4" /> },
    { name: "Productos", href: "/products", icon: <Package className="w-4 h-4" /> },
    { name: "Ofertas", href: "/offers", icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <AnnouncementBar />

      <div className="bg-background/95 backdrop-blur-md border-b">
        {/* FILA SUPERIOR: Logo, Buscador y Acciones */}
        <div className="mx-auto max-w-360 flex h-16 lg:h-20 items-center justify-between gap-4 px-4 lg:px-10">
          <div className="flex items-center gap-4">
            <MobileMenu 
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              menuView={mobileMenuView}
              setMenuView={setMobileMenuView}
              categories={categories}
              loading={loading}
              navLinks={navLinks}
            />
            <Logo />
          </div>

          <SearchInput className="hidden lg:flex flex-1 max-w-2xl mx-12" />

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Wishlist */}
            <NavBadgeIcon 
              href="/wishlist" 
              count={totalFavorites} 
              icon={<Heart className="h-6 w-6" />} 
              hoverClass="hover:text-indigo-500 hover:bg-indigo-50"
            />
            {/* Carrito */}
            <NavBadgeIcon 
              href="/cart" 
              count={totalItems} 
              icon={<ShoppingCart className="h-6 w-6" />} 
              isCart 
            />
          </div>
        </div>

        {/* FILA INFERIOR: Navegación Desktop */}
        <nav className="hidden lg:block border-t border-border/40 bg-muted/5">
          <div className="mx-auto max-w-360 px-10 flex items-center justify-between h-12">
            <div className="flex items-center gap-2 h-full">
              <MegaMenu 
                categories={categories}
                loading={loading}
                isHovered={isMegaMenuHovered}
                setIsHovered={setIsMegaMenuHovered}
              />
              <DesktopLinks navLinks={navLinks} pathname={pathname} />
            </div>
            <SupportLinks />
          </div>
        </nav>

        {/* Buscador Mobile (Se muestra solo en pantallas pequeñas bajo el logo) */}
        <div className="lg:hidden px-4 pb-4">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}