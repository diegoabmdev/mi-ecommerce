"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types/product";
import { productService } from "@/services/productService";

export function useCategory(slug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (slug) {
          const data = await productService.getProductsByCategory(slug);
          setProducts(data);
        } else {
          const data = await productService.getCategories();
          setCategories(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { products, categories, loading, error };
}
