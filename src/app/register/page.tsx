"use client";

import { useState } from "react";
import {
  UserPlus,
  Mail,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { authService } from "@/services/authService";
import { RegisterData } from "@/types/types";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.register(formData);
      toast.success(`¡Cuenta creada! Bienvenido ${data.firstName}`);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthFormWrapper
        title="Únete a la Elite"
        subtitle="Crea tu cuenta NovaCart en segundos"
        icon={UserPlus}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Nombre
            </label>
            <Input
              required
              placeholder="Nombre"
              className="h-14 rounded-2xl border-slate-100 bg-slate-50"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Apellido
            </label>
            <Input
              required
              placeholder="Apellido"
              className="h-14 rounded-2xl border-slate-100 bg-slate-50"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="email"
                required
                placeholder="tu@email.com"
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Usuario Único
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                required
                placeholder="ej: indigo_user"
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                required
                type="password"
                placeholder="ej: ******"
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="md:col-span-2 h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-lg font-black uppercase italic tracking-tighter transition-all group mt-4"
          >
            {loading ? (
              "Procesando..."
            ) : (
              <span className="flex items-center gap-2">
                Crear Cuenta{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
            <CheckCircle2 size={14} /> Encriptación verificada
          </div>
          <p className="text-sm text-slate-400 font-medium">
            ¿Ya eres miembro?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-bold hover:underline"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </AuthFormWrapper>
    </div>
  );
}
