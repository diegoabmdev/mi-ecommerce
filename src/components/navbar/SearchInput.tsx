"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchInput = ({ className }: { className?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    const params = new URLSearchParams(searchParams.toString());

    if (trimmedQuery) {
      params.set("search", trimmedQuery);
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  return (
    <div className={className}>
      <form onSubmit={handleSearch} className="relative w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué buscas hoy?"
          className="h-12 lg:h-12 pl-12 pr-4 bg-muted/40 border-2 border-transparent focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20 rounded-2xl text-base transition-all"
        />
      </form>
    </div>
  );
};
