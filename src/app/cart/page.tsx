// src/app/cart/page.tsx
"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  } = useCartStore();

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = () => {
    setCheckoutLoading(true);
    toast.loading("Procesando pago con Mercado Pago...");

    setTimeout(() => {
      toast.dismiss();
      toast.success(`¡Pago aprobado! Orden #${Math.floor(Math.random() * 1000000)}`);
      clearCart();
      setCheckoutLoading(false);
    }, 2500);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Carrito</h1>
        <p className="text-muted-foreground mb-8">Tu carrito está vacío</p>
        <Button asChild>
          <Link href="/">Seguir comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Carrito ({cartCount})</h1>
        <Button variant="outline" onClick={() => {
          clearCart();
          toast.success("Carrito limpiado");
        }}>
          Vaciar carrito
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 flex gap-4">
                <div className="relative w-24 h-24 shrink-0">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2">{item.title}</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success("Producto eliminado");
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ${(item.price * (1 - item.discountPercentage / 100) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Procesando..." : "Finalizar compra"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}