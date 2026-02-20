import Link from "next/link";
import React from "react";
import Image from "next/image";
import Tittles from "./Tittles";

const SECONDARY_POSTERS = [
  {
    title: "Mercado Gourmet",
    category: "groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
    desc: "Frescura en tu puerta",
  },
  {
    title: "Diseño Interior",
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    desc: "Confort moderno",
  },
  {
    title: "Cuidado Facial",
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1700107650012-36feae7e18ed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "Brillo natural",
  },
  {
    title: "Fragancias",
    category: "fragrances",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
    desc: "Aromas exclusivos",
  },
];

const Promotional = () => {
  return (
    <section className="container mx-auto space-y-6">
      <div className="flex items-end justify-between">
          <Tittles title="Destacadas" badge="Promociones" />
        </div>
        
      {/* Banner Principal Central (Laptops) */}
      <Link
        href="/products?category=laptops"
        className="relative block w-full h-75 md:h-80 overflow-hidden shadow-2xl group"
      >
        <Image
          src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Laptops Premium"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-center px-8 md:px-16">
          <span className="text-indigo-400 font-bold tracking-widest uppercase mb-2">
            Tecnología de Vanguardia
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white max-w-lg leading-tight">
            Potencia tu <br /> Creatividad.
          </h2>
          <div className="mt-6 flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
            Ver Colección <span className="text-2xl">→</span>
          </div>
        </div>
      </Link>

      {/* Grid de 4 Posters Inferiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 md:px-0">
        {SECONDARY_POSTERS.map((item) => (
          <Link
            key={item.category}
            href={`/products?category=${item.category}`}
            className="relative aspect-4/5 overflow-hidden shadow-lg group bg-slate-100"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
              <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">
                {item.desc}
              </p>
              <h3 className="text-xl font-bold">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Promotional;
