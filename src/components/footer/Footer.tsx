"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/5">
      {/* 1. Sección Newsletter */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center lg:text-left">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
                Únete al <span className="text-indigo-500">Club Tech</span>
              </h3>
              <p className="text-slate-400 mt-2">
                Recibe ofertas exclusivas y lanzamientos antes que nadie.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                placeholder="tu@email.com"
                className="bg-white/5 border-white/10 rounded-full px-6 focus:ring-indigo-500"
              />
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 font-bold">
                Suscribirme
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Enlaces Principales */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Marca y Bio */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter italic">
              NOVA<span className="text-indigo-500">CART</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Elevando tu estilo de vida digital con la mejor selección de tecnología y accesorios desde 2024. Calidad garantizada en cada entrega.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 bg-white/5 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Categorías</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/products?category=smartphones" className="hover:text-indigo-400 transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="hover:text-indigo-400 transition-colors">Laptops & PC</Link></li>
              <li><Link href="/products?category=fragrances" className="hover:text-indigo-400 transition-colors">Fragancias</Link></li>
              <li><Link href="/products?category=skincare" className="hover:text-indigo-400 transition-colors">Cuidado de Piel</Link></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Ayuda</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Seguimiento de Pedido</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Cambios y Devoluciones</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Términos de Servicio</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contacto</h4>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={18} className="text-indigo-500" />
              <span>Av. Tech 123, Santiago, CL</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={18} className="text-indigo-500" />
              <span>+56 9 1234 5678</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={18} className="text-indigo-500" />
              <span>soporte@geministore.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-white/5 bg-slate-950/50">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© {currentYear} GeminiStore. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
          <div className="flex items-center gap-4 grayscale opacity-50">
            {/* Aquí irían iconos de métodos de pago (Visa, Master, etc) */}
            <span className="border border-white/20 px-2 py-1 rounded">VISA</span>
            <span className="border border-white/20 px-2 py-1 rounded">PAYPAL</span>
            <span className="border border-white/20 px-2 py-1 rounded">MERCADOPAGO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;