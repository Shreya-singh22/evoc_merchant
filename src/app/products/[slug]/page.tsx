import { api } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  try {
    const products = await api.getProducts();
    if (!products || products.length === 0) {
      return [{ slug: 'placeholder' }];
    }
    return products.map((p) => ({ slug: p.slug || p.id }));
  } catch (err) {
    console.warn("generateStaticParams: backend unreachable, returning placeholder slug", err);
    return [{ slug: 'placeholder' }];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
