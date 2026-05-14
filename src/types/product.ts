export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  price: number;
  compareAt: number;
  currency: string;
  discountPct: number;
  inStock: boolean;
  tags: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  dateAdded: string;
  features: string[];
  sold: string;
  description: string;
  name: string;
  mrp: number;
  savings: number;
  coins: number;
  stock: number;
  variants: any[];
}
