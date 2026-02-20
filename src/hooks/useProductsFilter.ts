// hooks/useProductsFilter.ts
import { useState, useEffect, useMemo } from "react";
import { Product, Category } from "@/types/types";
import { productService } from "@/services/productService";
import { convertUSDtoCLP } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 8;

export function useProductsFilter(
  initialSearch: string,
  initialCategory: string,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: Number(searchParams.get("maxPrice")) || 10000000,
  });
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("minRating")) || 0,
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");

  // Estado de Paginación
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange.max, minRating, sortBy]);

  // Sincronizar con URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange.max < 10000000)
      params.set("maxPrice", priceRange.max.toString());
    if (minRating > 0) params.set("minRating", minRating.toString());
    if (sortBy !== "default") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    searchQuery,
    selectedCategory,
    priceRange.max,
    minRating,
    sortBy,
    currentPage,
    pathname,
    router,
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [pData, cData] = await Promise.all([
          productService.getAllProducts(),
          productService.getCategories(),
        ]);
        setProducts(pData);
        setCategories(cData);
      } catch (error) {
        console.error("Error loading catalogue:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // filtramos y ordenamos TODOS los productos
  const allFilteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory)
      result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim())
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    result = result.filter((p) => {
      const clp = convertUSDtoCLP(p.price);
      return clp >= priceRange.min && clp <= priceRange.max;
    });

    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    return result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  // Calculamos la paginación sobre los resultados filtrados ---
  const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return allFilteredProducts.slice(start, end);
  }, [allFilteredProducts, currentPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 10000000 });
    setMinRating(0);
    setSortBy("default");
    setCurrentPage(1);
    router.push(pathname);
  };

  return {
    filteredProducts: paginatedProducts,
    categories,
    isLoading,
    pagination: {
      currentPage,
      setCurrentPage,
      totalPages,
      totalResults: allFilteredProducts.length,
    },
    filters: {
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      priceRange,
      setPriceRange,
      minRating,
      setMinRating,
      sortBy,
      setSortBy,
    },
    clearFilters,
  };
}
