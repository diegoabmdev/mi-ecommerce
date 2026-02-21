"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export const AuthFormWrapper = ({
  children,
  title,
  subtitle,
  icon: Icon,
}: AuthFormWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-xl mx-auto"
  >
    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
          <Icon size={28} />
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
          {title}
        </h1>
        <p className="text-slate-500 font-medium mt-2">{subtitle}</p>
      </div>
      {children}
    </div>
  </motion.div>
);
