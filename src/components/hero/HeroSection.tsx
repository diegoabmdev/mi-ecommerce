import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface FeaturedProductsProps {
  children: React.ReactNode;
}

export function FeaturedProducts({ children }: FeaturedProductsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Productos Destacados
          </h2>
          <p className="mt-2 text-muted-foreground">
            Los favoritos de nuestros clientes
          </p>
        </div>
        <Button variant="ghost" asChild className="hidden text-accent hover:text-accent/80 md:flex">
          <Link href="/products">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      {children}
      <div className="mt-8 flex justify-center md:hidden">
        <Button variant="outline" asChild>
          <Link href="/products">
            Ver todos los productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}