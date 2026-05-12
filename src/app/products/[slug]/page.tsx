import ProductDetailClient from "./ProductDetailClient";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  try {
    const product = await api.getProduct(slug);
    
    if (!product) {
      return notFound();
    }

    return (
      <ProductDetailClient product={product} />
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}

export async function generateStaticParams() {
  try {
    const products = await api.getProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}
