// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";
import { MapPin, Truck, CreditCard, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { totalPrice, cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estado para datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Aquí llamaremos a nuestra API de Mercado Pago
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, shipping: shippingData }),
      });
      const { init_point } = await response.json();
      window.location.href = init_point; // Redirección al Paso 3
    } catch (error) {
      console.error("Error al iniciar pago", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Sección de Datos de Envío */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <MapPin className="text-indigo-600" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Envío
            </h2>
          </div>

          <div className="space-y-4">
            <AuthInput
              label="Nombre Receptor"
              icon={User}
              placeholder="Quién recibe?"
              onChange={(e) =>
                setShippingData({ ...shippingData, fullName: e.target.value })
              }
            />
            <AuthInput
              label="Dirección Exacta"
              icon={Truck}
              placeholder="Calle, número, depto"
              onChange={(e) =>
                setShippingData({ ...shippingData, address: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="Ciudad"
                icon={MapPin}
                placeholder="Santiago"
                onChange={(e) =>
                  setShippingData({ ...shippingData, city: e.target.value })
                }
              />
              <AuthInput
                label="Teléfono"
                icon={Truck}
                placeholder="+569..."
                onChange={(e) =>
                  setShippingData({ ...shippingData, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Resumen de Pago y Trigger MP */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 h-fit sticky top-10">
          <h2 className="text-xl font-black uppercase italic mb-6">
            Resumen Final
          </h2>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-slate-500 font-bold uppercase text-xs">
              <span>Productos ({cart.length})</span>
              <span>{formatCLP(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-emerald-500 font-bold uppercase text-xs">
              <span>Envío</span>
              <span>GRATIS</span>
            </div>
            <div className="pt-4 border-t flex justify-between items-baseline">
              <span className="font-black text-slate-900 uppercase italic">
                Total
              </span>
              <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                {formatCLP(totalPrice)}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !shippingData.address}
            className="w-full h-18 bg-indigo-600 hover:bg-slate-950 text-white rounded-2xl text-lg font-black uppercase italic transition-all shadow-lg py-8 flex gap-3"
          >
            {loading ? (
              "Generando Orden..."
            ) : (
              <>
                Pagar con Mercado Pago <ChevronRight />
              </>
            )}
          </Button>

          <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
            <CreditCard size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Pago 100% Seguro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
