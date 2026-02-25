"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Package, ReceiptText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCLP } from "@/lib/utils";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function SuccessPage() {
  const { cart, clearCart, totalPrice } = useCart();
  const { addOrder } = useUser();
  const searchParams = useSearchParams();
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hasProcessed = useRef(false);
  const router = useRouter();
  const [finalPaymentId, setFinalPaymentId] = useState("");
  const paymentId =
    searchParams.get("payment_id") ||
    `MP-${Math.floor(Math.random() * 1000000)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasProcessed.current || cart.length === 0) return;
    const urlId = searchParams.get("payment_id");
    const uniqueId = urlId || `NC-TEMP-${Date.now()}`;

    setFinalPaymentId(uniqueId);
    setPurchasedItems([...cart]);
    setOrderTotal(totalPrice);

    addOrder({
      id: uniqueId,
      date: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pagado",
      total: totalPrice,
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      items: [...cart],
    });

    hasProcessed.current = true;
    window.history.replaceState({}, "", "/success");

    const timer = setTimeout(() => clearCart(), 800);
    return () => clearTimeout(timer);
  }, [mounted, cart, addOrder, clearCart, totalPrice, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Card Principal */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/60 text-center mb-6">
          <div className="mb-6 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center text-indigo-600"
            >
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </motion.div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase mb-2">
            ¡Pedido <span className="text-indigo-500">Confirmado</span>!
          </h1>
          <p className="text-slate-500 font-medium mb-8">
            Gracias por tu compra. Tu transacción se completó con éxito.
          </p>

          {/* Resumen de Productos */}
          <div className="bg-slate-50 rounded-3xl p-6 text-left mb-8 border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <Package size={14} />
              <span>Artículos Adquiridos</span>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {purchasedItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0 relative overflow-hidden">
                    <Image
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    {formatCLP(item.product.price * 850 * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500 uppercase">
                Total Pagado
              </span>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                {formatCLP(orderTotal)}
              </span>
            </div>
          </div>

          {/* Metadata de Pago */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
              <ReceiptText size={12} />
              Ref: {finalPaymentId || "Procesando..."}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/">
              <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-bold text-sm shadow-lg transition-transform active:scale-95">
                Volver a la tienda
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-600 rounded-2xl h-14 font-bold text-sm hover:bg-slate-50 transition-transform active:scale-95"
              >
                Mis Pedidos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          E-commerce Demo Portafolio • 2026
        </p>
      </motion.div>
    </div>
  );
}
