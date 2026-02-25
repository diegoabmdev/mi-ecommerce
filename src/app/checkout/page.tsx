"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { AuthInput } from "@/components/auth/AuthInput";
import {
  MapPin,
  Truck,
  CreditCard,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";
import { Address } from "@/types/types";

export default function CheckoutPage() {
  const { totalPrice, cart } = useCart();
  const { addresses, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "+56",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    address: false,
    city: false,
    phone: false,
  });

  const validation = useMemo(() => ({
    fullName: shippingData.fullName.trim().length < 3 ? "Nombre demasiado corto" : null,
    address: shippingData.address.trim().length < 5 ? "Dirección incompleta o inválida" : null,
    city: shippingData.city.trim().length < 3 ? "Ciudad no válida" : null,
    phone: shippingData.phone.length < 12 ? "Formato: +56 9 1234 5678" : null,
  }), [shippingData]);

  const isFormValid = !Object.values(validation).some((v) => v !== null);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName} ${user.lastName}`,
        phone: prev.phone === "+56" && user.phone 
          ? `+56${user.phone.replace(/\D/g, "").slice(-9)}` 
          : prev.phone,
      }));
    }
  }, [user]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-20 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">
          Preparando tu Checkout...
        </div>
      </div>
    );
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const selectSavedAddress = (addr: Address) => {
    setShippingData({
      ...shippingData,
      address: addr.address,
      city: addr.city,
    });
    setTouched({ ...touched, address: true, city: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith("+56")) {
      const numbersOnly = value.slice(3).replace(/\D/g, "");
      if (numbersOnly.length <= 9) {
        setShippingData({ ...shippingData, phone: "+56" + numbersOnly });
      }
    }
  };

  const handlePayment = async () => {
    if (!isFormValid) {
      setTouched({ fullName: true, address: true, city: true, phone: true });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, shipping: shippingData }),
      });
      const { init_point } = await response.json();
      window.location.href = init_point;
    } catch (error) {
      console.error("Error al iniciar pago", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUMNA IZQUIERDA: Envío */}
        <div className="lg:col-span-7 space-y-8">
          <header className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <MapPin size={20} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
              Datos de Envío
            </h2>
          </header>

          {/* Selector de Direcciones Guardadas */}
          {addresses.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Usar dirección guardada
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => selectSavedAddress(addr)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left group ${
                      shippingData.address === addr.address
                        ? "border-indigo-600 bg-indigo-50/30"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      shippingData.address === addr.address ? "border-indigo-600" : "border-slate-200"
                    }`}>
                      <div className={`h-2.5 w-2.5 bg-indigo-600 rounded-full transition-transform ${
                        shippingData.address === addr.address ? "scale-100" : "scale-0"
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 uppercase italic leading-none mb-1">
                        {addr.address}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {addr.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Formulario Manual */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-1">
              <AuthInput
                label="Nombre de quien recibe"
                icon={User}
                value={shippingData.fullName}
                placeholder="Ej: Juan Pérez"
                onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                onBlur={() => handleBlur("fullName")}
                className={touched.fullName && validation.fullName ? "border-rose-500 bg-rose-50/30" : ""}
              />
              {touched.fullName && validation.fullName && (
                <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1 ml-4">
                  <AlertCircle size={12} /> {validation.fullName}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <AuthInput
                label="Dirección de Entrega"
                icon={Truck}
                value={shippingData.address}
                placeholder="Calle Falsa 123, Depto 404"
                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                onBlur={() => handleBlur("address")}
                className={touched.address && validation.address ? "border-rose-500 bg-rose-50/30" : ""}
              />
              {touched.address && validation.address && (
                <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1 ml-4">
                  <AlertCircle size={12} /> {validation.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <AuthInput
                  label="Ciudad"
                  icon={MapPin}
                  value={shippingData.city}
                  placeholder="Santiago"
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  onBlur={() => handleBlur("city")}
                  className={touched.city && validation.city ? "border-rose-500 bg-rose-50/30" : ""}
                />
                {touched.city && validation.city && (
                  <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1 ml-4">
                    <AlertCircle size={12} /> {validation.city}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <AuthInput
                  label="Teléfono de Contacto"
                  icon={Phone}
                  value={shippingData.phone}
                  placeholder="+56912345678"
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur("phone")}
                  className={touched.phone && validation.phone ? "border-rose-500 bg-rose-50/30" : ""}
                />
                {touched.phone && validation.phone && (
                  <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1 ml-4">
                    <AlertCircle size={12} /> {validation.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl sticky top-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16" />

            <h2 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
              <CheckCircle2 className="text-indigo-400" /> Resumen de Compra
            </h2>

            <div className="space-y-4 mb-8 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium line-clamp-1 flex-1 mr-4">
                    {item.quantity}x {item.product.title}
                  </span>
                  <span className="font-bold">
                    {formatCLP(item.product.price * 850 * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <div className="pt-4 flex justify-between items-baseline">
                <span className="text-2xl font-black uppercase italic tracking-tighter">
                  Total
                </span>
                <span className="text-4xl font-black text-indigo-400 tracking-tighter">
                  {formatCLP(totalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full h-20 rounded-[2rem] text-xl font-black uppercase italic transition-all shadow-xl flex gap-3 group ${
                  isFormValid 
                  ? "bg-indigo-500 hover:bg-white hover:text-indigo-600 text-white" 
                  : "bg-slate-800 text-slate-500"
                }`}
              >
                {loading ? "Procesando..." : (
                  <>
                    Pagar Ahora <CreditCard className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              {!isFormValid && (
                <p className="text-[10px] text-center mt-4 text-rose-400 font-bold uppercase tracking-widest animate-pulse">
                  Completa los campos en rojo
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-20">
              <CreditCard size={24} />
              <p className="text-[8px] font-black uppercase tracking-[0.2em] leading-tight text-center">
                Pago procesado por Mercado Pago<br/>Ambiente de prueba
              </p>
            </div>
          </div>

          {/* Info Sandbox */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500 p-2 rounded-xl text-white">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-indigo-900 font-black uppercase italic text-sm tracking-tighter">
                  Sandbox Mode
                </h3>
                <p className="text-indigo-700/70 text-[11px] leading-relaxed font-medium">
                  Usa tarjetas de prueba para completar este flujo.
                </p>
                <a
                  href="https://www.mercadopago.cl/developers/es/docs/vtex/resources/test-cards"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-[11px] uppercase tracking-wider hover:underline pt-1"
                >
                  Ver tarjetas <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}