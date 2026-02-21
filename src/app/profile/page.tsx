"use client";
import { useUser } from "@/context/UserContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, LogOut, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Address } from "@/types/types";
import Link from "next/link";

export default function ProfilePage() {
  const { user, addresses, logout, deleteAddress, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-400 font-black uppercase italic tracking-widest text-xs">
          Sincronizando Perfil...
        </p>
      </div>
    );
  }

  // 2. Estado No Autenticados
  if (!user) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-6">
        <h2 className="text-3xl font-black uppercase italic">
          Sesión no encontrada
        </h2>
        <Button asChild className="rounded-2xl bg-indigo-600">
          <Link href="/login">Ir al Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Perfil */}
      <header className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl">
          <Image
            src={user.image}
            alt={user.username}
            fill
            className="object-cover"
          />
        </div>

        <div className="text-center md:text-left flex-1">
          <Badge className="bg-indigo-500 mb-2 uppercase italic font-black">
            {user.role}
          </Badge>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-slate-400 font-medium">
            @{user.username} | {user.email}
          </p>
        </div>

        <Button
          onClick={logout}
          variant="destructive"
          className="rounded-2xl gap-2 uppercase font-bold italic hover:scale-105 transition-all"
        >
          <LogOut size={18} /> Cerrar Sesión
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección Direcciones */}
        <Card className="lg:col-span-2 p-8 rounded-[2.5rem] border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <MapPin className="text-indigo-600" /> Mis Direcciones
            </h2>
            <Button
              size="sm"
              className="rounded-xl bg-slate-900 hover:bg-indigo-500 transition-all hover:scale-105"
            >
              <Plus size={18} className="mr-1" /> Nueva
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  onDelete={() => deleteAddress(addr.id)}
                />
              ))
            ) : (
              <EmptyState
                icon={<MapPin className="text-slate-300 w-8 h-8" />}
                title="No hay direcciones"
                desc="Agrega una para agilizar tus compras."
              />
            )}
          </div>
        </Card>

        {/* Sección Compras */}
        <Card className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm bg-slate-50/50">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-2">
            <Package className="text-indigo-600" /> Compras
          </h2>
          <EmptyState
            icon={<Package className="text-slate-300 w-8 h-8" />}
            title="Sin pedidos"
            desc="Tus compras aparecerán aquí pronto."
          />
        </Card>
      </div>
    </div>
  );
}

function AddressCard({
  address,
  onDelete,
}: {
  address: Address;
  onDelete: () => void;
}) {
  return (
    <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 relative group transition-all hover:border-indigo-200">
      <p className="font-black text-slate-900 uppercase text-xs mb-1 tracking-widest">
        {address.name}
      </p>
      <p className="text-sm text-slate-500 font-medium leading-tight">
        {address.address}, {address.city}
      </p>
      {address.isDefault && (
        <Badge className="mt-2 bg-indigo-100 text-indigo-600 border-none text-[10px] font-bold uppercase">
          Predeterminada
        </Badge>
      )}
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-300 hover:text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-slate-50"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        {icon}
      </div>
      <p className="text-slate-500 font-black uppercase text-[10px] tracking-tighter">
        {title}
      </p>
      <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">
        {desc}
      </p>
    </div>
  );
}
