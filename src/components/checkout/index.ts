// Checkout components
export { default as CashPayment } from "./CashPayment";
export { default as OnlinePayment } from "./OnlinePayment";
export { default as CheckoutModal } from "./CheckoutModal";

// Re-export server actions for convenience
export {
  sendOtp,
  verifyOtp,
  getUserByPhone,
  getOrCreateUser,
  createAddress,
  getAddresses,
  createOrder,
  getOrder,
  getUserOrders,
  updateOrder,
} from "@/actions";