export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  sku: string;
  stock: number;
  images: string[];
  category: string;
  tags: string[];
  customFields: any;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  variants: any[];
}

export interface StorefrontInfo {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  description?: string;
  contactEmail?: string;
}

export interface PaginatedProducts {
  products: StorefrontProduct[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
