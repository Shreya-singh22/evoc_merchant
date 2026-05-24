import {
  APIResponse,
  PaginatedProducts,
  StorefrontProduct,
  StorefrontInfo,
} from "@/types/storefront";
import { Product } from "@/types/product";

const API_BASE_URL = "https://api.evoclabs.com/api";
const DEFAULT_SUBDOMAIN = "moonstruck";

/**
 * Maps API product structure to the local UI structure
 */
function mapStorefrontProduct(p: StorefrontProduct): Product {
  const price = parseFloat(p.price) || 0;
  const compareAt = p.compareAtPrice ? parseFloat(p.compareAtPrice) : 0;
  const discountPct =
    compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.name,
    subtitle: p.description || "",
    color: "",
    price: price,
    compareAt: compareAt,
    currency: "INR",
    discountPct: discountPct,
    inStock: p.stock > 0,
    tags: [p.category, ...(p.tags || [])].filter(Boolean),
    images:
      (p.images || []).filter((img) => img && typeof img === "string").length >
      0
        ? (p.images || []).filter((img) => img && typeof img === "string")
        : ["/placeholder-product.png"],
    rating: 4.5,
    reviewsCount:
      (p.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 80) +
      20,
    dateAdded: p.createdAt || "2024-01-01T00:00:00.000Z",
    description: p.description || "",
    sold: "500+",
    sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
    features: [
      "High-performance motor",
      "Premium build quality",
      "Modern aesthetic design",
      "Energy efficient operation",
      "2-year comprehensive warranty",
    ],
    name: p.name,
    mrp: compareAt || price,
    savings: (compareAt || price) - price,
    coins: Math.floor(price / 10),
    stock: p.stock || 10,
    variants: [
      { type: "Color", options: ["Midnight Black", "Champagne Gold"] },
    ],
  };
}

export const api = {
  async getProducts(subdomain: string = DEFAULT_SUBDOMAIN): Promise<Product[]> {
    const res = await fetch(
      `${API_BASE_URL}/storefront/public/${subdomain}/products`,
      {
        cache: "force-cache",
      },
    );
    if (!res.ok) throw new Error(`Failed to fetch products`);
    const json: APIResponse<PaginatedProducts> = await res.json();
    return (json.data.products || []).map(mapStorefrontProduct);
  },

  async getProductsByFlag(
    flag: "isBestSeller" | "isValueCombo" | "isNewArrival" | "isFeatured",
    subdomain: string = DEFAULT_SUBDOMAIN,
  ): Promise<StorefrontProduct[]> {
    const res = await fetch(
      `${API_BASE_URL}/storefront/public/${subdomain}/products?${flag}=true`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Failed to fetch products`);
    const json: APIResponse<PaginatedProducts> = await res.json();
    return json.data.products || [];
  },

  async getProduct(
    id: string,
    subdomain: string = DEFAULT_SUBDOMAIN,
  ): Promise<Product | null> {
    try {
      // 1. Try the specific detail API first
      const res = await fetch(
        `${API_BASE_URL}/storefront/public/${subdomain}/products/${id}`,
        {
          cache: "force-cache",
        },
      );

      if (res.ok) {
        const json: APIResponse<StorefrontProduct> = await res.json();
        return mapStorefrontProduct(json.data);
      }

      // 2. If detail API fails (like the current 500 error), fallback to the list API
      console.warn(
        `Detail API failed for ${id}, falling back to list search...`,
      );
      const allProducts = await this.getProducts(subdomain);
      const found = allProducts.find((p) => p.id === id || p.slug === id);

      return found || null;
    } catch (error) {
      console.error(`Network error fetching product ${id}:`, error);
      // Fallback on network error too
      const allProducts = await this.getProducts(subdomain).catch(() => []);
      return allProducts.find((p) => p.id === id || p.slug === id) || null;
    }
  },

  async getCategories(
    subdomain: string = DEFAULT_SUBDOMAIN,
  ): Promise<string[]> {
    const res = await fetch(
      `${API_BASE_URL}/storefront/public/${subdomain}/categories`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) throw new Error(`Failed to fetch categories`);
    const json: APIResponse<string[]> = await res.json();
    return json.data || [];
  },

  async getStoreInfo(
    subdomain: string = DEFAULT_SUBDOMAIN,
  ): Promise<StorefrontInfo> {
    const res = await fetch(
      `${API_BASE_URL}/storefront/public/${subdomain}/info`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) throw new Error(`Failed to fetch store info`);
    const json: APIResponse<StorefrontInfo> = await res.json();
    return json.data;
  },

  async createOrder(subdomain: string = DEFAULT_SUBDOMAIN, orderData: any) {
    const res = await fetch(
      `${API_BASE_URL}/storefront/${subdomain}/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      },
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to place order`);
    }
    return res.json();
  },
};
