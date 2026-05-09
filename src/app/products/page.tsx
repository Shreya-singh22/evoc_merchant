import React, { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { api } from "@/lib/api";

export default async function ProductsPage() {
  const products = await api.getProducts();

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream/15 text-charcoal">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Loading products...</span>
      </div>
    }>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
