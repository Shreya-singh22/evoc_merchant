// @orbit-360/commerce-client — TypeScript definitions

export class OrbitApiError extends Error {
  code: string;
  message: string;
  requestId: string;
  statusCode: number;
  constructor(code: string, message: string, requestId: string, statusCode?: number);
}

// ─── Shared types ────────────────────────────────────────────────────────────

export interface ApiMeta {
  requestId: string;
  tookMs: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'PREPAID';

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  variantId: string;
  qty: number;
}

export interface Buyer {
  name: string;
  phone: string;
  email: string;
}

export interface ShipTo {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Payment {
  method: PaymentMethod;
  intentId?: string;
}

export interface DirectCheckoutPayload {
  items: OrderItem[];
  buyer: Buyer;
  shipTo: ShipTo;
  payment: Payment;
}

export interface DirectCheckoutResult {
  orderId: string;
  trackingId: string;
  trackingUrl: string;
}

export interface TrackOrderResult {
  orderId: string;
  trackingId: string;
  status: OrderStatus;
  fulfillmentStatus: string | null;
  items: Array<{ productName: string; qty: number }>;
  createdAt: string;
  updatedAt: string;
  partnerTimestamps: object[] | null;
}

export interface LookupOrderResult {
  orderId: string;
  orderNumber: string;
  trackingId: string | null;
  status: OrderStatus;
  fulfillmentStatus: string | null;
  items: Array<{ productName: string; qty: number }>;
  createdAt: string;
  updatedAt: string;
}

// ─── Logistics ───────────────────────────────────────────────────────────────

export interface PincodeResult {
  serviceable: boolean;
  codEligible: boolean;
  estimatedDays: number | null;
  etaMessage: string;
}

export interface ShipmentEvent {
  status: string;
  timestamp: string;
  location: string | null;
  remarks: string | null;
}

export interface TrackShipmentResult {
  awb: string;
  carrier: string | null;
  status: string | null;
  events: ShipmentEvent[];
  estimatedDelivery: string | null;
}

export interface HotProduct {
  productId: string;
  productName: string;
  totalSold: number;
}

// ─── Client classes ───────────────────────────────────────────────────────────

export declare class OrdersClient {
  directCheckout(payload: DirectCheckoutPayload, idempotencyKey?: string): Promise<DirectCheckoutResult>;
  trackOrder(trackingId: string): Promise<TrackOrderResult>;
  lookupOrder(orderNumber: string, email: string): Promise<LookupOrderResult>;
}

export declare class LogisticsClient {
  checkPincode(pincode: string): Promise<PincodeResult>;
  trackShipment(awb: string): Promise<TrackShipmentResult>;
  getHotProducts(): Promise<{ products: HotProduct[] }>;
}

export interface CommerceClientConfig {
  baseUrl: string;
  storeId: string;
  timeout?: number;
}

export declare class CommerceClient {
  orders: OrdersClient;
  logistics: LogisticsClient;
  constructor(config: CommerceClientConfig);
}
