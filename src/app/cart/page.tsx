"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCLP, convertUSDtoCLP } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoaded
  } = useCart();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB4444]"></div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">Agrega productos para comenzar tu compra</p>
          <Link href="/">
            <Button className="bg-[#DB4444] hover:bg-[#c43d3d]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Lógica de envío basada en CLP
  const shipping = totalPrice >= 50000 ? 0 : 5000;
  const finalTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
          <p className="text-gray-600">
            {totalItems} producto{totalItems !== 1 ? "s" : ""} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const unitPriceCLP = convertUSDtoCLP(item.product.price);
              const subtotalItemCLP = unitPriceCLP * item.quantity;

              return (
                <div key={item.product.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-32 aspect-square bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.images?.[0] ?? item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${item.product.id}`} className="hover:text-[#DB4444] transition-colors">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.product.title}</h3>
                      </Link>
                      {/* Mostramos precio unitario convertido */}
                      <p className="text-2xl font-bold text-[#DB4444] mb-2">{formatCLP(unitPriceCLP)}</p>

                      {item.product.discountPercentage > 0 && (
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                          -{Math.round(item.product.discountPercentage)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="rounded-lg border border-gray-300 p-1.5 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="rounded-lg border border-gray-300 p-1.5 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCLP(subtotalItemCLP)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Carrito
            </Button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCLP(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-medium">{shipping === 0 ? "GRATIS" : formatCLP(shipping)}</span>
                </div>

                {shipping === 0 ? (
                  <p className="text-xs text-green-600">✓ ¡Felicitaciones! Tienes envío gratis</p>
                ) : (
                  <p className="text-xs text-orange-600">
                    Agrega {formatCLP(50000 - totalPrice)} más para envío gratis
                  </p>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#DB4444]">{formatCLP(finalTotal)}</span>
                </div>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#DB4444] hover:bg-[#c43d3d] text-white py-6 text-lg font-semibold mb-4"
              >
                Finalizar Compra
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Seguir Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}