// src/components/layout/MenuLink.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const MenuLink = forwardRef<HTMLAnchorElement, MenuLinkProps>(
  ({ href, children, className, ...props }, ref) => {
    const baseStyles = cn(
      "group relative flex items-center px-6 py-4 text-lg font-normal rounded-md",
      "hover:font-medium hover:bg-muted/70 hover:border-l-6 hover:border-indigo-500",
      className
    );

    return (
      <Link ref={ref} href={href} className={baseStyles} {...props}>
        {children}
      </Link>
    );
  }
);

MenuLink.displayName = "MenuLink";

export { MenuLink };