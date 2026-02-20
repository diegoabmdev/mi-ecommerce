import { Store } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="italic text-2xl lg:text-3xl font-black tracking-tighter text-indigo-600 hover:scale-105 transition-transform flex items-center">
    <Store className="w-8 h-8 mr-4" /> NOVA<span className="text-foreground">CART</span>
  </Link>
);