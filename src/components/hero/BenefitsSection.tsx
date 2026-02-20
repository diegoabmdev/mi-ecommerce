import { CreditCard, Headphones, ShieldCheck, TruckIcon } from "lucide-react";
import React from "react";

const BenefitsSection = () => {
  return (
    <section>
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <TruckIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Envío Gratis</h3>
              <p className="text-sm text-gray-600">En compras sobre $50.000</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Compra Segura</h3>
              <p className="text-sm text-gray-600">Protección al comprador</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <Headphones className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Atención 24/7</h3>
              <p className="text-sm text-gray-600">Soporte dedicado</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pago Seguro</h3>
              <p className="text-sm text-gray-600">MercadoPago integrado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
