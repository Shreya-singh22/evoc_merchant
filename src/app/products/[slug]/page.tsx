import ProductDetailClient from "./ProductDetailClient";


export function generateStaticParams() {
  return [
    { slug: "ultra-grind-750w" },
  ];
}

export default function ProductPage() {
  return (
    <ProductDetailClient />
  );
}
