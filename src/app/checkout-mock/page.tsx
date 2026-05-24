"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { sendOtp, verifyOtp, getUserByPhone, createAddress, getOrCreateUser } from "@/actions";
import { UserData } from "@/actions/user-actions";
import { addressSchema, customerDetailsSchema } from "@/lib/validation";
import CashPayment from "@/components/checkout/CashPayment";
import OnlinePayment from "@/components/checkout/OnlinePayment";
import {
  Loader2,
  Phone,
  Mail,
  User,
  MapPin,
  Home,
  Briefcase,
  Plus,
  CheckCircle2,
  Truck,
  ChevronRight,
  X,
} from "lucide-react";

type Step = "identify" | "verify" | "details" | "payment" | "success";

export default function CheckoutMockPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState<Step>("identify");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // User state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [user, setUser] = useState<UserData | null>(null);

  // Customer details
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    type: string;
    flatHouse: string;
    areaStreet: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string | null;
    isDefault: boolean;
  } | null>(null);

  // New address form
  const [newAddress, setNewAddress] = useState({
    type: "HOME",
    flatHouse: "",
    areaStreet: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: true,
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYU" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    items: typeof cartItems;
    totalAmount: number;
    codFee: number;
  } | null>(null);

  // OTP timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const COD_FEE = 40;

  // Send OTP
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
        setSessionId(result.sessionId || null);
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

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOtp({ phone, code: otp, sessionId: sessionId || undefined });
      if (result.success) {
        const userResult = await getUserByPhone(phone);
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          // Only auto-fill if name is stored and not already filled
          if (userResult.data.firstName && !customerFirstName) {
            setCustomerFirstName(userResult.data.firstName);
            setCustomerLastName(userResult.data.lastName || "");
          }
          if (userResult.data.email && !customerEmail) {
            setCustomerEmail(userResult.data.email);
          }
        }
        setStep("details");
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save address
  const handleSaveAddress = async () => {
    if (!user?.id) return;

    setError(null);
    setFieldErrors({});

    // Validate address form
    const result = addressSchema.safeParse(newAddress);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const createResult = await createAddress({
        userId: user.id,
        ...newAddress,
      });

      if (createResult.success) {
        const userResult = await getUserByPhone(phone);
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          if (createResult.data) {
            setSelectedAddress(createResult.data);
          }
        }
        setShowAddressForm(false);
        setNewAddress({
          type: "HOME",
          flatHouse: "",
          areaStreet: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
          isDefault: true,
        });
      } else if (createResult.message === "This address already exists") {
        setError("This address already exists");
      } else {
        throw new Error(createResult.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Continue to payment
  const handleContinueToPayment = async () => {
    setError(null);
    setFieldErrors({});

    // Validate customer details
    const detailsResult = customerDetailsSchema.safeParse({
      firstName: customerFirstName,
      lastName: customerLastName,
      email: customerEmail,
      phone: phone,
    });

    if (!detailsResult.success) {
      const errors: Record<string, string> = {};
      detailsResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    if (!selectedAddress) {
      setError("Please select or add a delivery address");
      return;
    }

    // Update user profile using server action
    setIsLoading(true);
    try {
      const result = await getOrCreateUser({
        phone,
        email: customerEmail,
        firstName: customerFirstName,
        lastName: customerLastName || undefined,
      });

      if (result.success && result.data) {
        setUser(result.data);
      }

      setStep("payment");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCompletedOrder({
      items: [...cartItems],
      totalAmount: subtotal,
      codFee: paymentMethod === "COD" ? COD_FEE : 0,
    });
    setStep("success");
    clearCart();
  };

  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h1>
            <button
              onClick={() => router.push("/")}
              className="bg-primary text-white font-black px-6 py-3 rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal">
      <Header />

      <main className="flex-grow py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          {["identify", "details", "payment"].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-2 whitespace-nowrap ${
                  step === s ? "text-primary font-black" : "text-charcoal/40 font-bold"
                } text-xs uppercase tracking-widest`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    step === s ? "border-primary bg-primary text-white" : "border-charcoal/10"
                  }`}
                >
                  {i + 1}
                </span>
                {s === "identify" ? "Login" : s === "details" ? "Details" : "Payment"}
              </div>
              {i < 2 && <ChevronRight size={14} className="text-charcoal/20" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
              {/* Step: Identify (Phone + OTP) */}
              {step === "identify" && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal text-balance">
                      Just one last step...
                    </h2>
                    <p className="text-sm text-charcoal/60 mt-1 text-pretty leading-relaxed">
                      Enter your phone number to proceed with your order.
                    </p>
                  </div>

                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={18} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="98765 43210"
                            className="w-full pl-12 pr-4 py-4 bg-cream/30 border border-primary/10 rounded-xl text-base focus:outline-none focus:border-primary transition-all font-bold"
                          />
                        </div>
                      </div>
                      {error && (
                        <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                          {error}
                        </p>
                      )}
                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-charcoal/60">
                          We&apos;ve sent a code to <span className="font-bold text-charcoal">+91 {phone}</span>
                        </p>
                        <button
                          onClick={() => {
                            setOtpSent(false);
                            setOtp("");
                          }}
                          className="text-xs text-primary font-bold mt-1"
                        >
                          Change number
                        </button>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          placeholder="0 0 0 0"
                          className="w-full text-center tracking-[1em] py-4 bg-cream/30 border border-primary/10 rounded-xl text-2xl focus:outline-none focus:border-primary transition-all font-black"
                        />
                      </div>
                      {error && (
                        <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                          {error}
                        </p>
                      )}
                      <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otp.length !== 4}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Continue"}
                      </button>
                      <button
                        onClick={handleSendOtp}
                        disabled={resendTimer > 0 || isLoading}
                        className="w-full text-primary font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                      >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step: Details */}
              {step === "details" && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-charcoal text-balance">
                        Your Details
                      </h2>
                      <p className="text-sm text-charcoal/60 mt-1 text-pretty leading-relaxed">
                        We&apos;ll use this to contact you about your order.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Verified ✓
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
                        <input
                          type="text"
                          value={customerFirstName}
                          onChange={(e) => {
                            setCustomerFirstName(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, firstName: "" }));
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                            fieldErrors.firstName ? "border-red-400 bg-red-50/30" : "border-primary/10"
                          }`}
                        />
                      </div>
                      {fieldErrors.firstName && (
                        <p className="text-[10px] text-red-500 font-bold">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
                        <input
                          type="text"
                          value={customerLastName}
                          onChange={(e) => {
                            setCustomerLastName(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, lastName: "" }));
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                            fieldErrors.lastName ? "border-red-400 bg-red-50/30" : "border-primary/10"
                          }`}
                        />
                      </div>
                      {fieldErrors.lastName && (
                        <p className="text-[10px] text-red-500 font-bold">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={16} />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          setFieldErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                          fieldErrors.email ? "border-red-400 bg-red-50/30" : "border-primary/10"
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-[10px] text-red-500 font-bold">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Saved Addresses */}
                  {user?.addresses && user.addresses.length > 0 && !showAddressForm && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-charcoal/60">
                          Delivery Address
                        </h3>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center gap-1 text-xs font-black text-primary"
                        >
                          <Plus size={14} /> Add New
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {user.addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`flex flex-col p-4 rounded-xl border-2 text-left transition-all ${
                              selectedAddress?.id === addr.id
                                ? "border-primary bg-primary/5"
                                : "border-primary/10 hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {addr.type === "HOME" ? (
                                <Home size={14} className="text-primary" />
                              ) : addr.type === "WORK" ? (
                                <Briefcase size={14} className="text-primary" />
                              ) : (
                                <MapPin size={14} className="text-primary" />
                              )}
                              <span className="text-[10px] font-black uppercase text-primary">
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-charcoal/40">Default</span>
                              )}
                              {selectedAddress?.id === addr.id && (
                                <CheckCircle2 size={14} className="text-primary ml-auto" />
                              )}
                            </div>
                            <p className="text-sm font-bold text-charcoal">
                              {customerFirstName} {customerLastName}
                            </p>
                            <p className="text-xs text-charcoal/60 line-clamp-2">
                              {addr.flatHouse}, {addr.areaStreet}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Address Form */}
                  {showAddressForm && (
                    <div className="space-y-4 border border-primary/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-charcoal/60">
                          Add New Address
                        </h3>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="text-charcoal/40 hover:text-charcoal"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {["HOME", "WORK", "OTHER"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setNewAddress({ ...newAddress, type })}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border ${
                              newAddress.type === type
                                ? "border-primary bg-primary text-white"
                                : "border-primary/20 text-charcoal/60"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <input
                        placeholder="House/Flat/Building"
                        value={newAddress.flatHouse}
                        onChange={(e) => {
                          setNewAddress({ ...newAddress, flatHouse: e.target.value });
                          setFieldErrors((prev) => ({ ...prev, flatHouse: "" }));
                        }}
                        className={`w-full px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                          fieldErrors.flatHouse ? "border-red-400 bg-red-50/30" : "border-primary/10"
                        }`}
                      />
                      {fieldErrors.flatHouse && (
                        <p className="text-[10px] text-red-500 font-bold -mt-2">{fieldErrors.flatHouse}</p>
                      )}

                      <input
                        placeholder="Street/Area/Landmark"
                        value={newAddress.areaStreet}
                        onChange={(e) => {
                          setNewAddress({ ...newAddress, areaStreet: e.target.value });
                          setFieldErrors((prev) => ({ ...prev, areaStreet: "" }));
                        }}
                        className={`w-full px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                          fieldErrors.areaStreet ? "border-red-400 bg-red-50/30" : "border-primary/10"
                        }`}
                      />
                      {fieldErrors.areaStreet && (
                        <p className="text-[10px] text-red-500 font-bold -mt-2">{fieldErrors.areaStreet}</p>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <input
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => {
                              setNewAddress({ ...newAddress, city: e.target.value });
                              setFieldErrors((prev) => ({ ...prev, city: "" }));
                            }}
                            className={`px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                              fieldErrors.city ? "border-red-400 bg-red-50/30" : "border-primary/10"
                            }`}
                          />
                          {fieldErrors.city && (
                            <p className="text-[10px] text-red-500 font-bold">{fieldErrors.city}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <input
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => {
                              setNewAddress({ ...newAddress, state: e.target.value });
                              setFieldErrors((prev) => ({ ...prev, state: "" }));
                            }}
                            className={`px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                              fieldErrors.state ? "border-red-400 bg-red-50/30" : "border-primary/10"
                            }`}
                          />
                          {fieldErrors.state && (
                            <p className="text-[10px] text-red-500 font-bold">{fieldErrors.state}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <input
                            placeholder="PIN Code"
                            value={newAddress.pincode}
                            onChange={(e) => {
                              setNewAddress({ ...newAddress, pincode: e.target.value });
                              setFieldErrors((prev) => ({ ...prev, pincode: "" }));
                            }}
                            maxLength={6}
                            className={`px-4 py-3 bg-cream/30 border rounded-xl text-sm focus:outline-none focus:border-primary ${
                              fieldErrors.pincode ? "border-red-400 bg-red-50/30" : "border-primary/10"
                            }`}
                          />
                          {fieldErrors.pincode && (
                            <p className="text-[10px] text-red-500 font-bold">{fieldErrors.pincode}</p>
                          )}
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-bold text-charcoal/60">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="w-4 h-4 rounded border-primary/20"
                        />
                        Set as default address
                      </label>

                      {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

                      <button
                        onClick={handleSaveAddress}
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-black py-3 rounded-xl disabled:opacity-70"
                      >
                        {isLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Save Address"}
                      </button>
                    </div>
                  )}

                  {/* Show form button if no addresses */}
                  {(!user?.addresses || user.addresses.length === 0) && !showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-primary/20 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-all"
                    >
                      <Plus size={16} /> Add Delivery Address
                    </button>
                  )}

                  {error && step === "details" && (
                    <p className="text-xs text-red-500 font-bold">{error}</p>
                  )}

                  <button
                    onClick={handleContinueToPayment}
                    disabled={isLoading || !selectedAddress}
                    className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continue to Payment"}
                  </button>
                </div>
              )}

              {/* Step: Payment */}
              {step === "payment" && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal text-balance">Payment Method</h2>
                    <p className="text-sm text-charcoal/60 mt-1 text-pretty leading-relaxed">
                      Select your preferred way to pay.
                    </p>
                  </div>

                  {paymentMethod === null ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => setPaymentMethod("COD")}
                        className="w-full flex items-center gap-4 p-4 border border-primary/10 rounded-xl bg-amber-50 hover:border-amber-200 transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">💵</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <Truck size={14} className="text-charcoal/60" />
                            <h4 className="text-sm font-black text-charcoal">Pay via Cash</h4>
                          </div>
                          <p className="text-[10px] text-charcoal/50">Cash on Delivery (+ Rs. {COD_FEE} fee)</p>
                        </div>
                        <ChevronRight className="text-charcoal/20" size={20} />
                      </button>

                      <button
                        onClick={() => setPaymentMethod("PAYU")}
                        className="w-full flex items-center gap-4 p-4 border border-primary/10 rounded-xl hover:border-primary/40 transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="text-lg">💳</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span className="text-charcoal/60 text-xs">💳</span>
                            <h4 className="text-sm font-black text-charcoal">Pay via Online</h4>
                          </div>
                          <p className="text-[10px] text-charcoal/50">Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                        <ChevronRight className="text-charcoal/20" size={20} />
                      </button>
                    </div>
                  ) : paymentMethod === "COD" ? (
                    <CashPayment
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setPaymentMethod(null)}
                      userId={user?.id || ""}
                      customerFirstName={customerFirstName}
                      customerLastName={customerLastName}
                      customerEmail={customerEmail}
                      items={cartItems}
                      totalAmount={subtotal}
                      codFee={COD_FEE}
                    />
                  ) : (
                    <OnlinePayment
                      onSuccess={handlePaymentSuccess}
                      onFailure={() => setPaymentMethod(null)}
                      onCancel={() => setPaymentMethod(null)}
                      userId={user?.id || ""}
                      customerFirstName={customerFirstName}
                      customerLastName={customerLastName}
                      customerEmail={customerEmail}
                      customerPhone={phone}
                      items={cartItems}
                      totalAmount={subtotal}
                    />
                  )}
                </div>
              )}

              {/* Step: Success */}
              {step === "success" && (
                <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-charcoal text-balance mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-sm text-charcoal/60 mb-4">
                    Order #{orderId?.split("-")[0]}
                  </p>
                  <p className="text-sm text-charcoal/60 max-w-xs text-pretty leading-relaxed">
                    Your shipment is being packed and will ship to you soon.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary/80">
                    <Truck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-8 bg-primary text-white font-black text-sm px-8 py-3 rounded-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>

              {step === "success" && completedOrder ? (
                <>
                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                    {completedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-cream/50 rounded-xl border border-primary/10 p-2 flex-shrink-0 relative">
                          <span className="absolute -top-2.5 -right-2.5 bg-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm z-10">
                            {item.quantity}
                          </span>
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-charcoal line-clamp-1">{item.name}</h4>
                          {item.variant && (
                            <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                              {item.variant}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-black text-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-primary/10 py-4 space-y-3">
                    <div className="flex justify-between text-sm text-charcoal/80">
                      <span>Subtotal</span>
                      <span className="font-bold">₹{completedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    {completedOrder.codFee > 0 && (
                      <div className="flex justify-between text-sm text-charcoal/80">
                        <span>COD Fee</span>
                        <span className="font-bold">₹{completedOrder.codFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-charcoal/80">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold tracking-wide uppercase text-xs">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-primary/10 pt-4 mb-6 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-wider text-charcoal/80">Total</span>
                    <span className="text-2xl font-black text-charcoal tabular-nums">
                      ₹{(completedOrder.totalAmount + completedOrder.codFee).toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-cream/50 rounded-xl border border-primary/10 p-2 flex-shrink-0 relative">
                          <span className="absolute -top-2.5 -right-2.5 bg-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm z-10">
                            {item.quantity}
                          </span>
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-charcoal line-clamp-1">{item.name}</h4>
                          {item.variant && (
                            <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                              {item.variant}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-black text-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-primary/10 py-4 space-y-3">
                    <div className="flex justify-between text-sm text-charcoal/80">
                      <span>Subtotal</span>
                      <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {paymentMethod === "COD" && (
                      <div className="flex justify-between text-sm text-charcoal/80">
                        <span>COD Fee</span>
                        <span className="font-bold">₹{COD_FEE}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-charcoal/80">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold tracking-wide uppercase text-xs">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-primary/10 pt-4 mb-6 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-wider text-charcoal/80">Total</span>
                    <span className="text-2xl font-black text-charcoal tabular-nums">
                      ₹{(subtotal + (paymentMethod === "COD" ? COD_FEE : 0)).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}