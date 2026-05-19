"use client";

import React, { useEffect, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { StorefrontProduct } from "@/types/storefront";
import Link from "next/link";

const PLACEHOLDER_IMG = "/placeholder-product.png";

export default function FeaturedProduct() {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getProductsByFlag("isFeatured")
      .then((products) => {
        if (cancelled) return;
        setProduct(products[0] || null);
      })
      .catch((err) => {
        console.error("Featured product fetch failed:", err);
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="lg:col-span-6 h-[400px] md:h-[550px] bg-cream rounded-3xl border border-primary/10 animate-pulse" />
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="h-4 w-40 bg-cream rounded animate-pulse" />
            <div className="h-12 w-3/4 bg-cream rounded animate-pulse" />
            <div className="h-4 w-full bg-cream rounded animate-pulse" />
            <div className="h-4 w-full bg-cream rounded animate-pulse" />
            <div className="h-24 w-full max-w-md bg-cream rounded-2xl animate-pulse mt-2" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) return null;

  const price = parseFloat(product.price) || 0;
  const compareAt = product.compareAtPrice ? parseFloat(product.compareAtPrice) || 0 : 0;
  const savings = compareAt > price ? compareAt - price : 0;
  const image = (product.images || []).find((u) => typeof u === "string" && u.length > 0) || PLACEHOLDER_IMG;
  const productHref = `/products/${product.id}`;

  return (
    <section id="featured" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Left Side: Product image */}
        <div className="lg:col-span-6 relative w-full h-[400px] md:h-[550px] animate-fade-in group select-none">
          <Link href={productHref} className="absolute inset-0 bg-cream rounded-3xl border border-primary/10 overflow-hidden flex items-center justify-center p-8 shadow-sm hover:shadow-xl transition-all duration-700 block">
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <span className="bg-primary/95 text-white text-[10px] font-black px-2.5 py-1 uppercase rounded-full tracking-wider shadow-sm">
                Limited Time Offer
              </span>
              {savings > 0 && (
                <span className="bg-gold text-charcoal text-[9px] font-black px-2 py-1 uppercase rounded-full tracking-wider shadow-sm">
                  Save ₹{savings.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Right Side: Copy, info, CTA */}
        <div className="lg:col-span-6 flex flex-col items-start gap-4 animate-fade-in select-none">
          <span className="text-primary text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Spotlight Collection
          </span>
          <Link href={productHref}>
            <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15] hover:text-primary transition-colors">
              {product.name}
            </h2>
          </Link>

          <div className="flex items-center gap-6 border-b border-gray-100 pb-4 mb-2 select-none">
            <div className="flex flex-col">
              <span className="text-xs text-charcoal/50 font-bold uppercase tracking-wider">
                Overall Score
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xl font-black text-charcoal">4.9</span>
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-primary/10" />
            <div className="flex flex-col">
              <span className="text-xs text-charcoal/50 font-bold uppercase tracking-wider">
                User Satisfaction
              </span>
              <span className="text-lg font-black text-charcoal mt-0.5">
                98% Happy Customers
              </span>
            </div>
          </div>

          {product.description && (
            <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl line-clamp-4">
              {product.description}
            </p>
          )}

          {/* Special pricing card */}
          <div className="bg-cream/50 p-4 md:p-5 rounded-2xl border border-primary/10 w-full max-w-md select-none mt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-primary/70 font-extrabold uppercase tracking-widest">
                  Bundle Deal Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-charcoal">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  {compareAt > price && (
                    <span className="text-sm text-charcoal/40 line-through">
                      ₹{compareAt.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
              {savings > 0 && (
                <span className="text-[10px] text-green-700 font-extrabold bg-green-100/60 px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                  Save ₹{savings.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  productId: product.id,
                  sku: product.sku || `SKU-${product.id.slice(0, 6)}`,
                  name: product.name,
                  price,
                  originalPrice: compareAt || price,
                  image,
                  quantity: 1,
                  variant: "Default",
                })
              }
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <ShoppingCart size={18} /> Buy Now — Limited Time Deal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
