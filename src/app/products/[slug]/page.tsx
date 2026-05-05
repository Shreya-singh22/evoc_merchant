import ProductDetailClient from "./ProductDetailClient";
import { CartProvider } from "@/context/CartContext";

export function generateStaticParams() {
  return [
    { slug: "ultra-grind-750w" },
  ];
}

export default function ProductPage() {
  return (
    <CartProvider>
      <ProductDetailClient />
    </CartProvider>
  );
}
