"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProductsFilter } from "@/hooks/useProductsFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/LoadingSkeleton";
import { Pagination } from "@/components/product/Pagination"; // Asegúrate de crear este componente
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search, RotateCcw } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const {
    filteredProducts,
    categories,
    isLoading,
    filters,
    pagination, // Extraemos la lógica de paginación del hook
    clearFilters,
  } = useProductsFilter(
    searchParams.get("search") || "",
    searchParams.get("category") || "",
  );

  // Efecto para volver al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagination.currentPage]);

  if (!isMounted) return <ProductGridSkeleton count={8} />;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Catálogo de Productos
          </h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-muted-foreground">
              Explora nuestra selección de tecnología premium.
            </p>
            {!isLoading && (
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                {pagination.totalResults} productos encontrados
              </span>
            )}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR DE FILTROS */}
          <aside
            className={`lg:w-72 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">Filtros</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Reiniciar
                </Button>
              </div>

              {/* Categorías */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                  Categorías
                </h3>
                <div className="flex flex-col gap-1 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                  <button
                    onClick={() => filters.setSelectedCategory("")}
                    className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      filters.selectedCategory === ""
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {isLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="h-9 w-full bg-gray-100 animate-pulse rounded-xl mb-1"
                          />
                        ))
                    : categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => filters.setSelectedCategory(cat.slug)}
                          className={`text-left px-3 py-2 rounded-xl text-sm capitalize transition-all ${
                            filters.selectedCategory === cat.slug
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                              : "hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-100"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                </div>
              </div>

              {/* Precio */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                  Presupuesto
                </h3>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex justify-between text-xs font-mono text-indigo-600 mb-4">
                    <span>$0</span>
                    <span>${filters.priceRange.max.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="10000"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      filters.setPriceRange((p) => ({
                        ...p,
                        max: Number(e.target.value),
                      }))
                    }
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <p className="text-[10px] text-gray-400 mt-3 text-center italic">
                    Desliza para ajustar el precio máximo
                  </p>
                </div>
              </div>

              {/* Calificación */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                  Calificación mínima
                </h3>
                <div className="flex gap-2">
                  {[4, 4.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => filters.setMinRating(rate)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                        filters.minRating === rate
                          ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {rate}+ ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="relative flex-1 min-w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="¿Qué estás buscando?"
                  value={filters.searchTerm}
                  onChange={(e) => filters.setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filters.sortBy}
                  onChange={(e) => filters.setSortBy(e.target.value)}
                  className="text-sm border-none bg-gray-50 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="default">Ordenar por</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating-desc">Mejor Calificados</option>
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid de Productos */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      product={product}
                    />
                  ))}
                </div>

                {/* COMPONENTE DE PAGINACIÓN */}
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
                <p className="text-gray-500">
                  No hay productos que coincidan con tu búsqueda.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="link"
                  className="text-indigo-600 mt-2"
                >
                  Restablecer filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <ProductsContent />
    </Suspense>
  );
}
