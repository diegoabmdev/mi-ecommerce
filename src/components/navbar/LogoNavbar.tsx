import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="italic text-2xl lg:text-3xl font-black tracking-tighter text-indigo-600 hover:scale-105 transition-transform">
    NOVA<span className="text-foreground">CART</span>
  </Link>
);