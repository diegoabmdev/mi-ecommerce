import { productService } from "@/services/productService";
import ProductDetail from "@/components/product/ProductDetail";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const idNumber: number = Number(id);

  const product = await productService.getProductById(idNumber);

  if (!product) {
    notFound();
  }

  return <ProductDetail key={id} product={product} />;
}