"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  sendOtp,
  verifyOtp,
  getUserByPhone,
  getOrCreateUser,
  validateCheckoutSession,
  createCheckoutSession,
} from "@/actions";
import { UserData, AddressData } from "@/actions/user-actions";
import { customerDetailsSchema } from "@/lib/validation";
import CashPayment from "@/components/checkout/CashPayment";
import OnlinePayment from "@/components/checkout/OnlinePayment";
import CustomerDetailsForm from "@/components/checkout/CustomerDetailsForm";
import AddressSelector from "@/components/checkout/AddressSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import StepIndicator from "@/components/checkout/StepIndicator";
import {
  Loader2,
  Phone,
  CheckCircle2,
  Truck,
} from "lucide-react";

const DEVICE_ID_KEY = "checkout_device_id";
const COD_FEE = 40;

type Step = "loading" | "identify" | "verify" | "details" | "payment" | "success";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [step, setStep] = useState<Step>("loading");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");

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
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYU" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    items: typeof cartItems;
    totalAmount: number;
    codFee: number;
  } | null>(null);

  // Memoized values
  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  // Initialize device ID and check session on mount
  useEffect(() => {
    let storedDeviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!storedDeviceId) {
      storedDeviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    const checkSession = async () => {
      const sessionResult = await validateCheckoutSession();
      if (sessionResult.valid && sessionResult.phone) {
        setPhone(sessionResult.phone);
        const userResult = await getUserByPhone(sessionResult.phone);
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          if (userResult.data.firstName) {
            setCustomerFirstName(userResult.data.firstName);
          }
          if (userResult.data.lastName) {
            setCustomerLastName(userResult.data.lastName);
          }
          if (userResult.data.email) {
            setCustomerEmail(userResult.data.email);
          }
          if (userResult.data.addresses?.length > 0) {
            const defaultAddr =
              userResult.data.addresses.find((a) => a.isDefault) ||
              userResult.data.addresses[0];
            setSelectedAddress(defaultAddr);
          }
        }
        setStep("details");
      } else {
        setStep("identify");
      }
    };
    checkSession();
  }, []);

  // OTP timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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
        setResendTimer(120); // 2 minutes resend timer
        setStep("verify");
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
        await createCheckoutSession(phone, deviceId);

        const userResult = await getUserByPhone(phone);
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          if (userResult.data.firstName && !customerFirstName) {
            setCustomerFirstName(userResult.data.firstName);
            setCustomerLastName(userResult.data.lastName || "");
          }
          if (userResult.data.email && !customerEmail) {
            setCustomerEmail(userResult.data.email);
          }
          if (userResult.data.addresses?.length > 0) {
            const defaultAddr =
              userResult.data.addresses.find((a) => a.isDefault) ||
              userResult.data.addresses[0];
            setSelectedAddress(defaultAddr);
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

  // Continue to payment
  const handleContinueToPayment = async () => {
    setError(null);
    setFieldErrors({});

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

  // Loading state
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-charcoal/40">
            Loading checkout...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
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
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
              {/* Step: Identify */}
              {step === "identify" && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="text-2xl font-sans font-bold text-charcoal text-balance">
                      Just one last step...
                    </h2>
                    <p className="text-sm text-charcoal/60 mt-1 text-pretty leading-relaxed">
                      Enter your phone number to proceed with your order.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        inputMode="numeric"
                        className="w-full pl-12 pr-4 py-4 bg-cream/30 border border-primary/10 rounded-xl text-base focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 font-bold">{error}</p>
                  )}
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              )}

              {/* Step: Verify */}
              {step === "verify" && (
                <div className="animate-fade-in space-y-4">
                  <p className="text-sm text-charcoal/60">
                    We&apos;ve sent a code to{" "}
                    <span className="font-bold text-charcoal">+91 {phone}</span>
                  </p>
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
                      className="w-full text-center tracking-[1em] py-4 bg-cream/30 border border-primary/10 rounded-xl text-2xl focus:outline-none focus:border-primary transition-all font-black tabular-nums"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 font-bold">{error}</p>
                  )}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 4}
                    className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>
                  <button
                    onClick={handleSendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="w-full text-primary font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </div>
              )}

              {/* Step: Details */}
              {step === "details" && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-sans font-bold text-charcoal text-balance">
                        Your Details
                      </h2>
                      <p className="text-sm text-charcoal/60 mt-1 text-pretty leading-relaxed">
                        We&apos;ll use this to contact you about your order.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>

                  <CustomerDetailsForm
                    firstName={customerFirstName}
                    lastName={customerLastName}
                    email={customerEmail}
                    onFirstNameChange={setCustomerFirstName}
                    onLastNameChange={setCustomerLastName}
                    onEmailChange={setCustomerEmail}
                    fieldErrors={fieldErrors}
                    onFieldChange={(field) =>
                      setFieldErrors((prev) => ({ ...prev, [field]: "" }))
                    }
                  />

                  {user && (
                    <AddressSelector
                      userId={user.id}
                      phone={phone}
                      addresses={user.addresses}
                      selectedAddress={selectedAddress}
                      onAddressSelect={setSelectedAddress}
                      onUserUpdate={setUser}
                    />
                  )}

                  {error && step === "details" && (
                    <p className="text-xs text-red-500 font-bold">{error}</p>
                  )}

                  <button
                    onClick={handleContinueToPayment}
                    disabled={isLoading || !selectedAddress}
                    className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>
                </div>
              )}

              {/* Step: Payment */}
              {step === "payment" && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="text-2xl font-sans font-bold text-charcoal text-balance">
                      Payment Method
                    </h2>
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
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                          💵
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
                            Pay via Cash
                          </h4>
                          <p className="text-[10px] text-charcoal/50 mt-0.5">
                            Cash on Delivery (+ Rs. {COD_FEE} fee)
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("PAYU")}
                        className="w-full flex items-center gap-4 p-4 border border-primary/10 rounded-xl hover:border-primary/40 transition-all text-left"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                          💳
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xs font-black uppercase tracking-wider text-charcoal">
                            Pay via Online
                          </h4>
                          <p className="text-[10px] text-charcoal/50 mt-0.5">
                            Credit/Debit Card, UPI, Net Banking
                          </p>
                        </div>
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
                      customerPhone={phone}
                      items={cartItems}
                      totalAmount={subtotal}
                      codFee={COD_FEE}
                      shippingAddress={selectedAddress}
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
                  <h2 className="text-2xl font-sans font-bold text-charcoal text-balance mb-2">
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
            <OrderSummary
              paymentMethod={paymentMethod}
              completedOrder={completedOrder}
              codFee={COD_FEE}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}