"use client";

import React, { useEffect, useState } from "react";
import { Star, ShieldCheck, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { StorefrontProduct } from "@/types/storefront";
import Link from "next/link";

type TabKey = "Best Sellers" | "Value Combos" | "New Arrivals";

type FlagKey = "isBestSeller" | "isValueCombo" | "isNewArrival";

const TAB_CONFIG: Array<{ label: TabKey; flag: FlagKey; badge: string }> = [
  { label: "Best Sellers", flag: "isBestSeller", badge: "Best Seller" },
  { label: "Value Combos", flag: "isValueCombo", badge: "Value Pack" },
  { label: "New Arrivals", flag: "isNewArrival", badge: "New Launch" },
];

interface DisplayProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  savings: number;
  rating: number;
  reviews: number;
  variants: string[];
  badge: string;
  coins: number;
  image1: string;
  image2: string;
  stock: number;
}

const PLACEHOLDER_IMG = "/placeholder-product.png";

function toDisplayProduct(p: StorefrontProduct, badge: string): DisplayProduct {
  const price = parseFloat(p.price) || 0;
  const mrp = p.compareAtPrice ? parseFloat(p.compareAtPrice) || price : price;
  const images = (p.images || []).filter((u) => typeof u === "string" && u.length > 0);
  const variantNames = Array.isArray(p.variants) && p.variants.length > 0
    ? p.variants.map((v: { name?: string }) => v?.name).filter((n: unknown): n is string => Boolean(n))
    : [];

  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    price,
    mrp,
    savings: Math.max(0, mrp - price),
    rating: 4.7,
    reviews: 0,
    variants: variantNames,
    badge,
    coins: Math.floor(price / 10),
    image1: images[0] || PLACEHOLDER_IMG,
    image2: images[1] || images[0] || PLACEHOLDER_IMG,
    stock: p.stock || 0,
  };
}

export default function Discover() {
  const [activeTab, setActiveTab] = useState<TabKey>("Best Sellers");
  const [productsByTab, setProductsByTab] = useState<Partial<Record<TabKey, DisplayProduct[]>>>({});
  const [loadingTab, setLoadingTab] = useState<TabKey | null>(null);
  const [errorTab, setErrorTab] = useState<TabKey | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    if (productsByTab[activeTab]) return;
    const cfg = TAB_CONFIG.find((t) => t.label === activeTab);
    if (!cfg) return;

    let cancelled = false;
    setLoadingTab(activeTab);
    setErrorTab(null);

    api
      .getProductsByFlag(cfg.flag)
      .then((products) => {
        if (cancelled) return;
        const mapped = products.map((p) => toDisplayProduct(p, cfg.badge));
        setProductsByTab((prev) => ({ ...prev, [activeTab]: mapped }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Discover fetch failed:", err);
        setErrorTab(activeTab);
      })
      .finally(() => {
        if (!cancelled) setLoadingTab((cur) => (cur === activeTab ? null : cur));
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, productsByTab]);

  const handleSelectVariant = (prodId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [prodId]: variant }));
  };

  const activeProducts = productsByTab[activeTab] || [];
  const isLoading = loadingTab === activeTab && !productsByTab[activeTab];
  const hasError = errorTab === activeTab && !productsByTab[activeTab];

  return (
    <section id="discover" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 select-none bg-cream/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl animate-fade-in flex flex-col gap-2">
          <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Premium Selection
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
            Discover Excellence
          </h2>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
            Engineered for optimum performance, reliability, and modern efficiency. High-end builds made for daily use.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-xl border border-primary/10 shadow-sm w-full md:w-auto overflow-x-auto self-start md:self-end">
          {TAB_CONFIG.map((t) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`flex-1 md:flex-none text-xs md:text-sm font-black tracking-wide px-5 md:px-7 py-3 rounded-lg transition-all cursor-pointer text-center ${
                activeTab === t.label
                  ? "bg-primary text-white shadow-md scale-[1.02]"
                  : "bg-transparent text-charcoal/70 hover:text-primary hover:bg-cream/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-charcoal/60">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span className="text-sm font-semibold">Loading {activeTab.toLowerCase()}…</span>
        </div>
      ) : hasError ? (
        <div className="py-20 text-center text-charcoal/60 text-sm font-semibold">
          Couldn&apos;t load {activeTab.toLowerCase()}. Please try again.
        </div>
      ) : activeProducts.length === 0 ? (
        <div className="py-20 text-center text-charcoal/60 text-sm font-semibold">
          No products in {activeTab.toLowerCase()} yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 animate-fade-in">
          {activeProducts.map((p) => {
            const currentVariant = selectedVariants[p.id] || p.variants[0] || "";
            const isSoldOut = p.stock === 0;
            const isLowStock = p.stock > 0 && p.stock <= 5;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col group relative"
              >
                {/* Product Badge */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="bg-primary/95 text-white text-[10px] font-black px-2.5 py-1 uppercase rounded-full shadow-md tracking-wider">
                    {p.badge}
                  </span>
                  {p.savings > 0 && (
                    <span className="bg-gold text-charcoal text-[9px] font-black px-2 py-1 uppercase rounded-full shadow-md tracking-wider flex items-center gap-1">
                      Save ₹{p.savings.toLocaleString("en-IN")}
                    </span>
                  )}
                  {isLowStock && (
                    <span className="bg-white/95 text-primary font-bold text-[10px] px-2.5 py-1 uppercase rounded-full shadow-md tracking-wider">
                      Only {p.stock} left
                    </span>
                  )}
                </div>

                {/* Hover-swap product image */}
                <Link href={`/products/${p.id}`} className="relative w-full h-64 md:h-72 bg-cream/10 overflow-hidden flex items-center justify-center p-6 cursor-pointer block">
                  <img
                    src={p.image1}
                    alt={p.name}
                    className="w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    loading="lazy"
                  />
                  <img
                    src={p.image2}
                    alt={p.name}
                    className="w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute inset-0 p-6 m-auto"
                    loading="lazy"
                  />
                </Link>

                {/* Product Info & CTA */}
                <div className="p-5 md:p-6 flex flex-col flex-grow bg-white border-t border-gray-50 relative select-none">
                  <div className="flex items-center gap-1 text-gold mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(p.rating) ? "fill-gold text-gold" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-xs text-charcoal/60 font-semibold ml-1">
                      ({p.reviews})
                    </span>
                  </div>

                  <Link href={`/products/${p.id}`} className="block w-fit">
                    <h3 className="text-base md:text-lg font-black text-charcoal leading-tight mb-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                  </Link>

                  <p className="text-xs md:text-sm text-charcoal/60 font-normal leading-relaxed mb-4 flex-grow line-clamp-2">
                    {p.description}
                  </p>

                  {/* Variant Selector */}
                  {p.variants.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-[10px] font-extrabold text-charcoal/40 uppercase tracking-widest">
                        Model Variant:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.variants.map((v) => (
                          <button
                            key={v}
                            onClick={() => handleSelectVariant(p.id, v)}
                            className={`text-[10px] font-bold px-2.5 py-1 border rounded-lg transition-all cursor-pointer ${
                              currentVariant === v
                                ? "bg-charcoal text-white border-charcoal scale-105"
                                : "bg-white text-charcoal/70 border-gray-200 hover:border-primary/40"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing & Savings Callout */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3.5 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-primary/70 font-extrabold uppercase tracking-wider">
                        Special Deal Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-charcoal">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        {p.mrp > p.price && (
                          <span className="text-xs text-charcoal/40 line-through">
                            ₹{p.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      {p.savings > 0 && (
                        <span className="text-[10px] text-green-700 font-extrabold bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                          <ShieldCheck size={11} className="inline text-green-700" /> Save ₹{p.savings.toLocaleString("en-IN")}
                        </span>
                      )}
                      <span className="text-[9px] text-primary font-bold mt-1 tracking-wider uppercase">
                        Earn +{p.coins} Coins
                      </span>
                    </div>
                  </div>

                  {/* Loyalty coins indicator */}
                  <div className="mb-4 bg-primary/5 p-2 rounded-xl text-[10px] text-primary font-bold text-center border border-primary/10 select-none">
                    Use &quot;Moonstruck Coins&quot; to redeem up to 10% on future orders!
                  </div>

                  {/* Quick Add to Cart button */}
                  <button
                    onClick={() =>
                      addToCart({
                        id: currentVariant ? `${p.id}_${currentVariant}` : p.id,
                        name: p.name,
                        price: p.price,
                        originalPrice: p.mrp,
                        image: p.image1,
                        quantity: 1,
                        variant: currentVariant,
                      })
                    }
                    disabled={isSoldOut}
                    className={`w-full text-center font-black text-xs md:text-sm py-3.5 rounded-xl transition-all ${
                      isSoldOut
                        ? "bg-charcoal/20 text-charcoal/50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/95 text-white cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {isSoldOut ? "Sold Out" : "Quick Add To Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 md:mt-16 text-center select-none">
        <Link
          href="/products"
          className="inline-block bg-transparent text-charcoal border border-charcoal/30 hover:border-primary hover:text-primary font-bold text-sm px-10 py-3.5 rounded-xl transition-all cursor-pointer hover:shadow-sm"
        >
          Browse All Premium Collections
        </Link>
      </div>
    </section>
  );
}
