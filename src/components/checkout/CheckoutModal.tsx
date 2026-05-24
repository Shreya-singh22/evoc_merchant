"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Truck, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import CashPayment from "./CashPayment";
import OnlinePayment from "./OnlinePayment";
import { useCart } from "@/context/CartContext";
import { sendOtp, verifyOtp, getUserByPhone } from "@/actions";

type PaymentMethod = "cash" | "online" | null;

interface User {
  id: string;
  phone: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isVerified?: boolean;
  addresses: Address[];
  orders?: unknown[];
}

interface Address {
  id: string;
  type: string;
  flatHouse: string;
  areaStreet: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string | null;
  isDefault: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutStart?: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onCheckoutStart,
}: CheckoutModalProps) {
  const { cartItems } = useCart();
  const [step, setStep] = useState<"customer" | "payment" | "success">("customer");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // User state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const COD_FEE = 40;

  // Send OTP using server action
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendOtp({ phone });
      if (result.success) {
        setOtpSent(true);
        setResendTimer(60);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP using server action
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOtp({ phone, code: otp });
      if (result.success) {
        const userData = await getUserByPhone(phone);
        if (userData.success && userData.data) {
          setUser(userData.data);
        } else if (result.data) {
          setUser({
            id: result.data.userId,
            phone,
            addresses: [],
          });
        }
        setOtpVerified(true);
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId);
    setStep("success");
    if (onCheckoutStart) onCheckoutStart();
  };

  const handleBack = () => {
    setPaymentMethod(null);
  };

  if (!isOpen) return null;

  // Success State
  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">
              Order Confirmed!
            </h3>
            <p className="text-sm text-charcoal/70 mb-4">
              Order #{orderId?.split("-")[0]}
            </p>
            <p className="text-sm text-charcoal/60 leading-relaxed max-w-xs">
              Your shipment is being packed and will ship to you soon.
            </p>
            <div className="mt-6 flex items-center gap-2 text-primary/80">
              <Truck size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="mt-8 bg-primary text-white font-black text-sm px-8 py-3 rounded-xl cursor-pointer hover:bg-primary/95 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-primary/10 bg-cream/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="text-lg font-serif font-bold text-charcoal tracking-tight">
              {step === "customer" ? "Checkout" : "Payment"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream border border-transparent hover:border-primary/20 rounded-full text-charcoal hover:text-primary transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === "customer" && (
            <>
              {/* Phone + OTP Section */}
              {!otpVerified ? (
                <div className="space-y-4 mb-6">
                  <div className="text-xs font-extrabold text-charcoal/60 uppercase tracking-widest">
                    {otpSent ? "Verify OTP" : "Enter Phone Number"}
                  </div>

                  {!otpSent ? (
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="flex-1 px-4 py-3 bg-cream/30 border border-primary/10 rounded-xl text-base focus:outline-none focus:border-primary transition-all font-bold"
                      />
                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="bg-primary text-white font-black px-4 rounded-xl disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Send OTP"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-charcoal/60">
                        Sent to +91 {phone}
                        <button
                          onClick={() => {
                            setOtpSent(false);
                            setOtp("");
                          }}
                          className="ml-2 text-primary font-bold cursor-pointer"
                        >
                          Change
                        </button>
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="0000"
                          className="flex-1 text-center tracking-[0.5em] py-3 bg-cream/30 border border-primary/10 rounded-xl text-xl font-black focus:outline-none focus:border-primary"
                        />
                        <button
                          onClick={handleVerifyOtp}
                          disabled={isLoading || otp.length !== 4}
                          className="bg-primary text-white font-black px-4 rounded-xl disabled:opacity-50 cursor-pointer"
                        >
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify"}
                        </button>
                      </div>
                      <button
                        onClick={handleSendOtp}
                        disabled={resendTimer > 0 || isLoading}
                        className="text-xs text-primary font-bold disabled:text-charcoal/40 cursor-pointer"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  )}

                  {error && (
                    <p className="text-xs text-red-500 font-bold">{error}</p>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-charcoal/60 uppercase tracking-widest">
                      Verified
                    </span>
                    <button
                      onClick={() => setOtpVerified(false)}
                      className="text-xs text-primary font-bold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm font-bold text-charcoal">+91 {phone}</p>
                  {user?.firstName && (
                    <p className="text-xs text-charcoal/60">{user.firstName} {user.lastName}</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Payment Section */}
          {step === "payment" && (
            <div className="space-y-3">
              {paymentMethod === "cash" ? (
                <CashPayment
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleBack}
                  userId={user?.id || ""}
                  items={cartItems}
                  totalAmount={subtotal}
                  codFee={COD_FEE}
                />
              ) : paymentMethod === "online" ? (
                <OnlinePayment
                  onSuccess={handlePaymentSuccess}
                  onFailure={() => setPaymentMethod(null)}
                  onCancel={handleBack}
                  userId={user?.id || ""}
                  customerFirstName={user?.firstName || ""}
                  customerLastName={user?.lastName || ""}
                  customerEmail={user?.email || ""}
                  customerPhone={phone}
                  items={cartItems}
                  totalAmount={subtotal}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Footer - Order Summary & Actions */}
        {step === "customer" && otpVerified && (
          <div className="border-t border-primary/10 p-5 flex-shrink-0 bg-cream/20">
            {/* Payment Options */}
            <div className="space-y-3 mb-4">
              <button
                onClick={() => {
                  setPaymentMethod("cash");
                  setStep("payment");
                }}
                className="w-full flex items-center gap-4 p-4 border border-primary/10 rounded-xl bg-white hover:bg-amber-50 hover:border-amber-200 transition-all text-left cursor-pointer"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💵</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-charcoal/60" />
                    <h4 className="text-sm font-black text-charcoal">Pay via Cash</h4>
                  </div>
                  <p className="text-[10px] text-charcoal/50">
                    Cash on Delivery (+ Rs. {COD_FEE} fee)
                  </p>
                </div>
                <div className="w-5 h-5 border-2 border-primary/20 rounded-full" />
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("online");
                  setStep("payment");
                }}
                className="w-full flex items-center gap-4 p-4 border border-primary/10 rounded-xl bg-white hover:border-primary/40 transition-all text-left cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard size={20} className="text-primary" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-charcoal/60" />
                    <h4 className="text-sm font-black text-charcoal">Pay via Online</h4>
                  </div>
                  <p className="text-[10px] text-charcoal/50">
                    Credit/Debit Card, UPI, Net Banking
                  </p>
                </div>
                <div className="w-5 h-5 border-2 border-primary/20 rounded-full" />
              </button>
            </div>

            {/* Total */}
            <div className="border-t border-primary/10 pt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-charcoal/60 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-lg font-black text-charcoal">
                  ₹{(subtotal + COD_FEE).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                Includes Rs. {COD_FEE} COD fee
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}