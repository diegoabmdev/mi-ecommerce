"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "emilys",
    password: "emilyspass",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      router.push("/profile");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <AuthFormWrapper 
        title="Bienvenido a NovaCart" 
        subtitle="Ingresa tus credenciales para continuar" 
        icon={Zap}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Usuario */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-indigo-500 transition-all"
                placeholder="ej: emilys"
                required
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-black uppercase italic tracking-tighter shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            {loading ? "Verificando..." : (
              <span className="flex items-center gap-2">
                Entrar al sistema <ArrowRight size={20} />
              </span>
            )}
          </Button>
        </form>

        {/* Info de prueba */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider text-center">
            Cuenta de prueba: emilys / emilyspass
          </p>
        </div>

        <p className="text-center mt-8 text-sm text-slate-400 font-medium">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Crea una ahora
          </Link>
        </p>
      </AuthFormWrapper>
    </div>
  );
}