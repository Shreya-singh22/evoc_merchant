import { api } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  try {
    const products = await api.getProducts();
    return products.map((p) => ({ slug: p.slug || p.id }));
  } catch (err) {
    console.warn("generateStaticParams: backend unreachable, returning empty slug list", err);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
