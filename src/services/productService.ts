import { Product, ProductsResponse, Category } from "@/types/types";

const BASE_URL = "https://dummyjson.com";

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) throw new Error("Error al obtener los productos");

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Product Service Error:", error);
      throw error;
    }
  },

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error("Producto no encontrado");
      return response.json();
    } catch (error) {
      console.error("Product Service Error:", error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) throw new Error("Error al obtener categorías");
      return response.json();
    } catch (error) {
      console.error("Product Service Error:", error);
      throw error;
    }
  },

  async getProductsByCategory(slug: string): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${slug}`);
      if (!response.ok)
        throw new Error(`Error al obtener productos de ${slug}`);
      const data: ProductsResponse = await response.json();
      return data.products;
    } catch (error) {
      console.error("Product Service Error:", error);
      throw error;
    }
  },
};
