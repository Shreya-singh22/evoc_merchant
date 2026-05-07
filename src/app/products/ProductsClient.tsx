"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Check, 
  Info, 
  RefreshCw 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS_CATALOG, Product } from "@/data/products";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/evoc_merchant' : '';

// Available categories for filtering
const CATEGORY_OPTIONS = [
  "Kitchen",
  "Home Appliances",
  "Mixer Grinder",
  "Juicer Mixer Grinder",
  "Electric Kettle",
  "Toaster",
  "Steam Iron",
  "Winter Appliances",
  "Summer Appliances",
  "Air Cooler",
  "Juicer"
];

export default function ProductsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // --- State Driven Filters from URL ---
  const currentSort = searchParams.get("sort") || "featured";
  const currentInStockOnly = searchParams.get("inStock") === "true";
  const currentSelectedCategories = useMemo(() => {
    const cats = searchParams.get("categories");
    return cats ? cats.split(",") : [];
  }, [searchParams]);

  const currentMinPrice = Number(searchParams.get("minPrice")) || 0;
  const currentMaxPrice = Number(searchParams.get("maxPrice")) || 20000;

  // --- Local UI States ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Accordion open states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Temporary inputs for price inputs to prevent lagging
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice.toString());
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice.toString());

  // Set inputs when URL changes
  useEffect(() => {
    setMinPriceInput(currentMinPrice.toString());
    setMaxPriceInput(currentMaxPrice.toString());
  }, [currentMinPrice, currentMaxPrice]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("moonstruck_wishlist");
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    // Simulate premium loading state with skeleton shimmers
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Update URL search parameters
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Toggle wishlist state
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("moonstruck_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Sort Change
  const handleSortChange = (sortType: string) => {
    updateParams({ sort: sortType });
  };

  // Handle Category Toggle
  const handleCategoryToggle = (category: string) => {
    let updated = [...currentSelectedCategories];
    if (updated.includes(category)) {
      updated = updated.filter((c) => c !== category);
    } else {
      updated.push(category);
    }
    updateParams({ categories: updated.length ? updated.join(",") : null });
  };

  // Handle Stock Toggle
  const handleStockToggle = (checked: boolean) => {
    updateParams({ inStock: checked ? "true" : null });
  };

  // Handle Price Apply
  const applyPriceFilter = () => {
    updateParams({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setMinPriceInput("0");
    setMaxPriceInput("20000");
    router.push(pathname);
  };

  // Remove a single category filter chip
  const removeCategoryChip = (category: string) => {
    const updated = currentSelectedCategories.filter((c) => c !== category);
    updateParams({ categories: updated.length ? updated.join(",") : null });
  };

  // --- Filter and Sort logic ---
  const filteredProducts = useMemo(() => {
    return (PRODUCTS_CATALOG || []).filter((product) => {
      if (!product) return false;

      // 1. Availability Filter
      if (currentInStockOnly && !product.inStock) return false;

      // 2. Price Filter
      const price = product.price || 0;
      if (price < currentMinPrice || price > currentMaxPrice) return false;

      // 3. Category Filter (Matches tags)
      if (currentSelectedCategories.length > 0) {
        const tags = product.tags || [];
        const matchesCategory = tags.some((tag) =>
          currentSelectedCategories.includes(tag)
        );
        if (!matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (!a || !b) return 0;

      // 4. Sorting logic
      switch (currentSort) {
        case "best-selling":
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        case "alphabetical-az":
          return (a.title || "").localeCompare(b.title || "");
        case "alphabetical-za":
          return (b.title || "").localeCompare(a.title || "");
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "date-new-old":
          return new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime();
        case "date-old-new":
          return new Date(a.dateAdded || 0).getTime() - new Date(b.dateAdded || 0).getTime();
        case "featured":
        default:
          const aFeatured = (a.tags || []).includes("Best Seller") ? 1 : 0;
          const bFeatured = (b.tags || []).includes("Best Seller") ? 1 : 0;
          return bFeatured - aFeatured || (a.id || "").localeCompare(b.id || "");
      }
    });
  }, [currentSort, currentInStockOnly, currentSelectedCategories, currentMinPrice, currentMaxPrice]);

  // Format currency in Indian standard ₹1,399 format
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen select-none bg-cream/15 text-charcoal font-sans">
      {/* Top Announcement & Header Navigation */}
      <div className="sticky top-0 z-40 w-full shadow-sm">
        <div className="bg-primary text-white text-[10px] md:text-xs font-semibold py-2.5 text-center tracking-widest uppercase flex items-center justify-center gap-1.5 px-4">
          <span>Free shipping across India · Call (+91) 84486 09059</span>
        </div>
        <Header />
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-charcoal/50 mb-6 font-medium">
          <a href={`${BASE_PATH}/`} className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <span className="text-charcoal font-bold">All Products</span>
        </nav>

        {/* Dynamic Title / Intro */}
        <div className="mb-10 text-left animate-fade-in">
          <span className="text-primary text-[10px] md:text-xs font-black tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Celestial Craftsmanship
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-charcoal tracking-tight mt-1.5">
            Discover Moonstruck Collection
          </h1>
          <p className="text-charcoal/60 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
            Sophisticated design meets cutting-edge technology. Experience luxury home and kitchen appliances engineered to stand the test of time.
          </p>
        </div>

        {/* PLP Toolbar */}
        <div className="flex items-center justify-between border-y border-primary/10 py-4 mb-8 bg-white/50 backdrop-blur-sm rounded-xl px-4 shadow-xs">
          {/* Result Count */}
          <div className="text-xs md:text-sm text-charcoal/70 font-semibold uppercase tracking-wider">
            {loading ? (
              <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded" />
            ) : (
              `${filteredProducts.length} ${filteredProducts.length === 1 ? "Product" : "Products"} Found`
            )}
          </div>

          {/* Desktop & Tablet Sort Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-charcoal/50 font-bold uppercase tracking-widest">Sort By:</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs font-bold border border-primary/10 rounded-full py-2 px-4 bg-white text-charcoal shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40 hover:border-primary/20 transition-all"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="alphabetical-az">Alphabetical: A–Z</option>
              <option value="alphabetical-za">Alphabetical: Z–A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="date-new-old">Date: New to Old</option>
              <option value="date-old-new">Date: Old to New</option>
            </select>
          </div>

          {/* Mobile Filter & Sort Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 text-xs font-black uppercase tracking-wider border border-primary/25 bg-primary text-white rounded-full py-2.5 px-6 shadow-md hover:bg-primary/95 transition-all"
          >
            <SlidersHorizontal size={14} />
            <span>Filter & Sort</span>
          </button>
        </div>

        {/* Active Filter Chips Row */}
        {(currentSelectedCategories.length > 0 || currentInStockOnly || currentMinPrice > 0 || currentMaxPrice < 20000) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] text-charcoal/40 font-black uppercase tracking-widest">Active Filters:</span>
            
            {currentSelectedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => removeCategoryChip(cat)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 transition-all hover:bg-primary hover:text-white"
              >
                <span>{cat}</span>
                <X size={10} />
              </button>
            ))}

            {currentInStockOnly && (
              <button
                onClick={() => handleStockToggle(false)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 transition-all hover:bg-primary hover:text-white"
              >
                <span>In Stock Only</span>
                <X size={10} />
              </button>
            )}

            {(currentMinPrice > 0 || currentMaxPrice < 20000) && (
              <button
                onClick={() => {
                  setMinPriceInput("0");
                  setMaxPriceInput("20000");
                  updateParams({ minPrice: null, maxPrice: null });
                }}
                className="flex items-center gap-1 text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 transition-all hover:bg-primary hover:text-white"
              >
                <span>{formatCurrency(currentMinPrice)} - {formatCurrency(currentMaxPrice)}</span>
                <X size={10} />
              </button>
            )}

            <button
              onClick={clearAllFilters}
              className="text-[10px] font-extrabold uppercase text-primary/70 hover:text-primary transition-all underline ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* --- Desktop Filter Sidebar --- */}
          <aside className="hidden md:block w-64 flex-shrink-0 bg-white border border-primary/10 rounded-2xl p-6 shadow-sm sticky top-28">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <span className="font-serif font-black text-lg tracking-tight text-charcoal">Filters</span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-primary/70 hover:text-primary transition-colors underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Accordion */}
              <div className="border-b border-gray-100 pb-5">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm text-charcoal text-left py-1 hover:text-primary transition-colors"
                >
                  <span>Category</span>
                  {isCategoryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {isCategoryOpen && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isChecked = currentSelectedCategories.includes(cat);
                      return (
                        <label key={cat} className="flex items-center gap-2.5 text-xs text-charcoal/80 cursor-pointer hover:text-primary transition-colors py-0.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(cat)}
                            className="rounded border-gray-300 text-primary focus:ring-primary/40 h-3.5 w-3.5"
                          />
                          <span className={isChecked ? "font-bold text-charcoal" : "font-medium"}>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Availability Accordion */}
              <div className="border-b border-gray-100 pb-5">
                <button
                  onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm text-charcoal text-left py-1 hover:text-primary transition-colors"
                >
                  <span>Availability</span>
                  {isAvailabilityOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {isAvailabilityOpen && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-charcoal/80 cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={currentInStockOnly}
                        onChange={(e) => handleStockToggle(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary/40 h-3.5 w-3.5"
                      />
                      <span className={currentInStockOnly ? "font-bold text-charcoal" : "font-medium"}>In stock</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Price Range Accordion */}
              <div>
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="w-full flex items-center justify-between font-serif font-bold text-sm text-charcoal text-left py-1 hover:text-primary transition-colors"
                >
                  <span>Price Range</span>
                  {isPriceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {isPriceOpen && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] text-charcoal/40 font-bold uppercase block mb-1">From</span>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-charcoal/40">₹</span>
                          <input
                            type="number"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            placeholder="0"
                            className="w-full bg-cream/30 border border-primary/10 rounded-lg py-2 pl-6 pr-2 text-xs focus:ring-1 focus:ring-primary/40 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-charcoal/40 font-bold uppercase block mb-1">To</span>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs text-charcoal/40">₹</span>
                          <input
                            type="number"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            placeholder="20000"
                            className="w-full bg-cream/30 border border-primary/10 rounded-lg py-2 pl-6 pr-2 text-xs focus:ring-1 focus:ring-primary/40 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={applyPriceFilter}
                      className="w-full bg-charcoal text-white hover:bg-primary font-bold uppercase text-[10px] tracking-widest py-2 rounded-lg transition-colors shadow-xs"
                    >
                      Apply Price
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* --- Product Grid & States --- */}
          <div className="flex-grow w-full">
            {loading ? (
              // --- Skeleton Shimmer Loading State ---
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-primary/5 rounded-2xl overflow-hidden p-4 space-y-4">
                    <div className="aspect-square bg-gray-200 animate-pulse rounded-xl w-full" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
                      <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              // --- Empty State Friendly Illustration ---
              <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 bg-white border border-primary/10 rounded-2xl p-6 shadow-xs max-w-xl mx-auto">
                <span className="text-4xl md:text-5xl mb-4 text-gold animate-bounce">✦</span>
                <h3 className="text-2xl font-serif font-black text-charcoal mb-2">No Celestial Products Found</h3>
                <p className="text-charcoal/60 text-sm md:text-base max-w-sm mb-6 leading-relaxed">
                  We couldn't find any premium appliances matching your active filter criteria. Try expanding your search options.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-primary/95 text-white font-black uppercase text-xs tracking-widest py-3.5 px-8 rounded-full shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // --- Active Product Grid ---
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
                {filteredProducts.map((product) => {
                  const isSaved = wishlist.includes(product?.id || "");
                  const isOutOfStock = !product?.inStock;
                  const productCompareAt = product?.compareAt || 0;
                  const productPrice = product?.price || 0;
                  const productTags = product?.tags || [];
                  return (
                    <article
                      key={product?.id || ""}
                      className="group bg-white border border-primary/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col h-full relative cursor-pointer"
                    >
                      {/* Top Badges & Actions */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                        {productCompareAt > productPrice && (
                          <span className="bg-primary text-white text-[9px] font-black px-2.5 py-1 uppercase rounded-full tracking-wider shadow-sm">
                            Save {product?.discountPct || 0}%
                          </span>
                        )}
                        {productTags.includes("Best Seller") && (
                          <span className="bg-gold text-charcoal text-[9px] font-black px-2.5 py-1 uppercase rounded-full tracking-wider shadow-sm">
                            Best Seller
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="bg-gray-500 text-white text-[9px] font-black px-2.5 py-1 uppercase rounded-full tracking-wider shadow-sm">
                            Sold Out
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product?.id || "");
                        }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-xs border border-primary/10 shadow-xs hover:scale-110 active:scale-95 transition-all text-charcoal"
                        aria-label={`Toggle wishlist for ${product?.title || ""}`}
                      >
                        <Heart
                          size={15}
                          className={isSaved ? "fill-red-500 text-red-500" : "text-charcoal/60"}
                        />
                      </button>

                      {/* Product Image Swap Area */}
                      <a href={`${BASE_PATH}/products/${product?.slug || ""}`} className="relative aspect-square w-full overflow-hidden bg-cream/10 border-b border-primary/5 block">
                        <img
                          src={product?.images?.[0] || ""}
                          alt={product?.title || ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 absolute inset-0 opacity-100 group-hover:opacity-0"
                          loading="lazy"
                        />
                        {product?.images?.[1] && (
                          <img
                            src={product?.images?.[1] || ""}
                            alt={`${product?.title || ""} side view`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 absolute inset-0 opacity-0 group-hover:opacity-100"
                            loading="lazy"
                          />
                        )}
                      </a>

                      {/* Card Content Details */}
                      <div className="p-5 flex flex-col flex-grow gap-2.5">
                        {/* Rating Row */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-gold">
                            <Star size={11} className="fill-gold text-gold" />
                          </div>
                          <span className="text-[10px] font-bold text-charcoal/80">{product?.rating || 0}</span>
                          <span className="text-[10px] text-charcoal/40 font-medium">({product?.reviewsCount || 0} reviews)</span>
                        </div>

                        {/* Title & Technical features */}
                        <div className="flex flex-col gap-1 flex-grow">
                          <a
                            href={`${BASE_PATH}/products/${product?.slug || ""}`}
                            className="text-base font-serif font-black text-charcoal hover:text-primary transition-colors leading-tight line-clamp-2"
                          >
                            {product?.title || ""}
                          </a>
                          <p className="text-[10px] text-charcoal/50 leading-relaxed font-semibold line-clamp-2 uppercase mt-0.5 tracking-wide">
                            {product?.subtitle || ""}
                          </p>
                        </div>

                        {/* Price Block */}
                        <div className="flex items-end justify-between border-t border-primary/5 pt-4 mt-1.5">
                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-charcoal">{formatCurrency(productPrice)}</span>
                              {productCompareAt > productPrice && (
                                <span className="text-xs text-charcoal/30 line-through font-medium">{formatCurrency(productCompareAt)}</span>
                              )}
                            </div>
                            {productCompareAt > productPrice && (
                              <span className="text-[9px] text-green-700 font-extrabold bg-green-100/60 border border-green-200/50 px-1.5 py-0.5 rounded-md mt-1 w-fit uppercase">
                                Save {formatCurrency(productCompareAt - productPrice)}
                              </span>
                            )}
                          </div>

                          {/* Quick add / hover button */}
                          <button
                            disabled={isOutOfStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart({
                                id: `${product?.id || ""}_default`,
                                name: product?.title || "",
                                price: productPrice,
                                originalPrice: productCompareAt,
                                image: product?.images?.[0] || "",
                                quantity: 1,
                                variant: "Standard Edition",
                              });
                            }}
                            className={`p-2.5 rounded-xl border border-primary/10 shadow-xs hover:border-primary transition-all text-charcoal hover:bg-primary hover:text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent ${
                              isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                            aria-label={`Quick add ${product?.title || ""} to cart`}
                          >
                            <ShoppingCart size={15} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Mobile Bottom Sheet Filters & Sort --- */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto z-10 flex flex-col p-6 animate-fade-in origin-bottom shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                <span className="font-serif font-black text-xl text-charcoal">Filter & Sort</span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full bg-cream hover:bg-primary hover:text-white text-charcoal transition-colors"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sort options */}
            <div className="mb-6">
              <span className="font-serif font-bold text-sm text-charcoal block mb-3">Sort By</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "featured", label: "Featured" },
                  { value: "best-selling", label: "Best Selling" },
                  { value: "alphabetical-az", label: "Alphabetical: A–Z" },
                  { value: "alphabetical-za", label: "Alphabetical: Z–A" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "date-new-old", label: "Date: New to Old" }
                ].map((option) => {
                  const isSelected = currentSort === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`text-left text-xs font-bold py-2.5 px-4 rounded-xl border transition-all ${
                        isSelected 
                          ? "bg-primary text-white border-primary shadow-xs" 
                          : "bg-white text-charcoal/70 border-primary/10 hover:border-primary/30"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter segments */}
            <div className="space-y-6 flex-grow">
              {/* Category */}
              <div>
                <span className="font-serif font-bold text-sm text-charcoal block mb-3">Category</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isChecked = currentSelectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`text-xs font-bold py-2 px-3.5 rounded-full border transition-all ${
                          isChecked 
                            ? "bg-primary text-white border-primary shadow-xs" 
                            : "bg-white text-charcoal/70 border-primary/10"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div>
                <span className="font-serif font-bold text-sm text-charcoal block mb-3">Availability</span>
                <label className="flex items-center gap-3 text-xs font-bold text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentInStockOnly}
                    onChange={(e) => handleStockToggle(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/40 h-4 w-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Price Range */}
              <div>
                <span className="font-serif font-bold text-sm text-charcoal block mb-3">Price Range</span>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase block mb-1">From</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs text-charcoal/40">₹</span>
                      <input
                        type="number"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        placeholder="0"
                        className="w-full bg-cream/30 border border-primary/10 rounded-lg py-2 pl-6 pr-2 text-xs focus:ring-1 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase block mb-1">To</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs text-charcoal/40">₹</span>
                      <input
                        type="number"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        placeholder="20000"
                        className="w-full bg-cream/30 border border-primary/10 rounded-lg py-2 pl-6 pr-2 text-xs focus:ring-1 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 mt-6 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full border border-primary/20 hover:border-primary text-charcoal font-bold uppercase text-[11px] tracking-widest py-3.5 rounded-xl transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  applyPriceFilter();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary/95 text-white font-black uppercase text-[11px] tracking-widest py-3.5 rounded-xl transition-all shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CartDrawer & Footer Navigation */}
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
