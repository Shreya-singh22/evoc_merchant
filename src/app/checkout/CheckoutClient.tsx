
"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { checkoutApi } from "@/lib/checkout-api";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Gift,
  Home,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Plus,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const addressSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "First name must only contain letters" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }).regex(/^[a-zA-Z\s]+$/, { message: "Last name must only contain letters" }),
  flatHouse: z.string().trim().min(3, { message: "House/Flat details are required" }),
  areaStreet: z.string().trim().min(3, { message: "Street details are required" }),
  city: z.string().trim().min(2, { message: "City is required" }).regex(/^[a-zA-Z\s]+$/, { message: "City must only contain letters" }),
  state: z.string().trim().min(2, { message: "State is required" }).regex(/^[a-zA-Z\s]+$/, { message: "State must only contain letters" }),
  pincode: z.string().trim().regex(/^\d{6}$/, { message: "Pincode must be 6 digits" }),
});

type Step = "LOADING" | "IDENTIFY" | "VERIFY" | "ADDRESS" | "PAYMENT" | "REDIRECTING" | "ERROR";

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");

  const [step, setStep] = useState<Step>("LOADING");
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);
  const [addressData, setAddressData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    flatHouse: "",
    areaStreet: "",
    city: "",
    state: "",
    pincode: "",
  });

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setStep("ERROR");
      setError("No session ID found. Please try again from the product page.");
      return;
    }

    try {
      const response = await checkoutApi.getSummary(sessionId);
      if (response.success) {
        setSession(response.data);

        // Map backend status to frontend step
        const status = response.data.status;
        if (status === "PENDING_AUTH") {
          setStep("IDENTIFY");
        } else if (status === "AUTHENTICATED") {
          setStep("ADDRESS");
          // Pre-fill email/name if available
          if (response.data.user) {
            setAddressData(prev => ({
              ...prev,
              email: response.data.user.email || "",
              firstName: response.data.user.firstName || "",
              lastName: response.data.user.lastName || "",
            }));

            // Handle Saved Addresses logic
            const savedAddresses = response.data.user.addresses || [];
            if (savedAddresses.length > 0) {
              // Default to the first saved address and show the selection list
              setSelectedAddressId(savedAddresses[0].id);
              setShowNewAddressForm(false);
            } else {
              setShowNewAddressForm(true);
            }
          }
        } else if (status === "ADDRESS_CONFIRMED") {
          setStep("PAYMENT");
        } else if (status === "COMPLETED" || status === "PLACED") {
          router.push(`/checkout/success?sessionId=${sessionId}`);
        } else {
          setStep("IDENTIFY");
        }
      }
    } catch (err: any) {
      console.error("Fetch Session Error:", err);
      setStep("ERROR");
      setError(err.message || "Failed to load checkout session.");
    }
  }, [sessionId, router]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      await checkoutApi.sendOtp(phone, sessionId);
      setStep("VERIFY");
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!sessionId || resendTimer > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await checkoutApi.sendOtp(phone, sessionId);
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      await checkoutApi.verifyOtp(phone, otp, sessionId);
      await fetchSession(); // Refresh to move to next step (ADDRESS)
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    let payload: any = {
      email: addressData.email,
      phone: phone || session?.user?.phone,
    };

    if (showNewAddressForm || !selectedAddressId) {
      const result = addressSchema.safeParse(addressData);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (path && !newErrors[path]) {
            newErrors[path] = issue.message;
          }
        });
        setFieldErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const validatedData = result.data;
      payload.newAddress = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        flatHouse: validatedData.flatHouse,
        areaStreet: validatedData.areaStreet,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        receiversPhone: phone || session?.user?.phone,
      };
    } else {
      payload.addressId = selectedAddressId;
    }

    try {
      await checkoutApi.updateProfile(sessionId, payload);
      await fetchSession(); // Refresh to move to PAYMENT
    } catch (err: any) {
      setError(err.message || "Failed to update address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async (method: string) => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await checkoutApi.finalize(sessionId, method);
      if (response.success) {
        if (response.data.paymentUrl) {
          setStep("REDIRECTING");
          window.location.href = response.data.paymentUrl;
        } else if (method === "COD") {
          router.push(`/checkout/success?sessionId=${sessionId}`);
        }
      }
    } catch (err: any) {
      setError(err.message || "Payment initialization failed.");
      setIsLoading(false);
    }
  };

  const getMediaUrl = (src: string) => (src && typeof src === 'string') ? (src.startsWith('http') ? src : `${src}`) : '';

  if (step === "LOADING") {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-charcoal/40">Securing your session...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "ERROR") {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-charcoal">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="bg-white p-10 rounded-2xl border border-red-100 shadow-xl max-w-md w-full text-center flex flex-col items-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-serif font-bold text-charcoal mb-2">Checkout Issue</h1>
            <p className="text-charcoal/70 mb-8">{error}</p>
            <Link href="/" className="bg-primary text-white font-black text-sm px-8 py-4 rounded-xl shadow-md">
              Return to Store
            </Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Flow Steps */}
          <div className="lg:col-span-7">

            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <div className={`flex items-center gap-2 whitespace-nowrap ${step === "IDENTIFY" || step === "VERIFY" ? "text-primary font-black" : "text-charcoal/40 font-bold"} text-xs uppercase tracking-widest`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step === "IDENTIFY" || step === "VERIFY" ? "border-primary bg-primary text-white" : "border-charcoal/10"}`}>1</span>
                Login
              </div>
              <ChevronRight size={14} className="text-charcoal/20" />
              <div className={`flex items-center gap-2 whitespace-nowrap ${step === "ADDRESS" ? "text-primary font-black" : "text-charcoal/40 font-bold"} text-xs uppercase tracking-widest`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step === "ADDRESS" ? "border-primary bg-primary text-white" : "border-charcoal/10"}`}>2</span>
                Shipping
              </div>
              <ChevronRight size={14} className="text-charcoal/20" />
              <div className={`flex items-center gap-2 whitespace-nowrap ${step === "PAYMENT" ? "text-primary font-black" : "text-charcoal/40 font-bold"} text-xs uppercase tracking-widest`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step === "PAYMENT" ? "border-primary bg-primary text-white" : "border-charcoal/10"}`}>3</span>
                Payment
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm min-h-[400px]">

              {/* STEP: IDENTIFY (Phone Input) */}
              {step === "IDENTIFY" && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal">Just one last step ... </h2>
                    <p className="text-sm text-charcoal/60 mt-1">Enter your phone number to proceed with your order.</p>
                  </div>
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={18} />
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full pl-12 pr-4 py-4 bg-cream/30 border border-primary/10 rounded-xl text-base focus:outline-none focus:border-primary transition-all font-bold"
                        />
                      </div>
                    </div>
                    {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP"}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP: VERIFY (OTP Input) */}
              {step === "VERIFY" && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal">Verify Identity</h2>
                    <p className="text-sm text-charcoal/60 mt-1">We&apos;ve sent a 4-digit code to <span className="font-bold text-charcoal">+91 {phone}</span></p>
                  </div>
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Verification Code</label>
                      <input
                        required
                        type="text"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="0 0 0 0"
                        className="w-full text-center tracking-[1em] py-4 bg-cream/30 border border-primary/10 rounded-xl text-2xl focus:outline-none focus:border-primary transition-all font-black"
                      />
                    </div>
                    {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Continue"}
                    </button>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={resendTimer > 0 || isLoading}
                        onClick={handleResendOtp}
                        className="w-full text-primary font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:text-charcoal/40 transition-colors"
                      >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep("IDENTIFY")}
                        className="w-full text-charcoal/40 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP: ADDRESS (Shipping Form) */}
              {/* STEP: ADDRESS (Shipping Form) */}
              {step === "ADDRESS" && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-charcoal">Shipping Details</h2>
                      <p className="text-sm text-charcoal/60 mt-1">Where should we deliver your premium appliance?</p>
                    </div>
                    {session?.user?.addresses?.length > 0 && !showNewAddressForm && (
                      <button
                        onClick={() => setShowNewAddressForm(true)}
                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                      >
                        <Plus size={14} /> Add New
                      </button>
                    )}
                  </div>

                  {session?.user?.addresses?.length > 0 && !showNewAddressForm ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {session.user.addresses.map((addr: any) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`flex flex-col p-4 rounded-2xl border-2 text-left transition-all ${selectedAddressId === addr.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-primary/10 hover:border-primary/30"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2 w-full">
                              <div className="flex items-center gap-2">
                                {addr.type === "HOME" ? <Home size={16} className="text-primary" /> :
                                  addr.type === "WORK" ? <Briefcase size={16} className="text-primary" /> :
                                    <MapPin size={16} className="text-primary" />}
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                  {addr.type}
                                </span>
                              </div>
                              {selectedAddressId === addr.id && (
                                <CheckCircle2 size={16} className="text-primary" />
                              )}
                            </div>
                            <span className="text-sm font-black text-charcoal">{addr.firstName} {addr.lastName}</span>
                            <p className="text-xs text-charcoal/60 mt-1 line-clamp-2 leading-relaxed">
                              {addr.flatHouse}, {addr.areaStreet}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Email Address</label>
                          <input
                            required
                            type="email"
                            value={addressData.email}
                            onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-cream/30 border border-primary/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={isLoading || !selectedAddressId}
                          className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isLoading ? <Loader2 className="animate-spin" /> : "Deliver to Selected Address"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-6" noValidate>
                      {session?.user?.addresses?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="text-xs font-bold text-primary underline mb-2 flex items-center gap-1"
                        >
                          &larr; Back to Saved Addresses
                        </button>
                      )}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Email Address</label>
                        <input
                          required
                          type="email"
                          value={addressData.email}
                          onChange={(e) => {
                            setAddressData({ ...addressData, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors(prev => {
                              const n = { ...prev };
                              delete n.email;
                              return n;
                            });
                          }}
                          className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.email ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm focus:outline-none focus:border-primary transition-all`}
                        />
                        {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.email}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">First Name</label>
                          <input
                            required
                            type="text"
                            value={addressData.firstName}
                            onChange={(e) => {
                              setAddressData({ ...addressData, firstName: e.target.value });
                              if (fieldErrors.firstName) setFieldErrors(prev => {
                                const n = { ...prev };
                                delete n.firstName;
                                return n;
                              });
                            }}
                            className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.firstName ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                          />
                          {fieldErrors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.firstName}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Last Name</label>
                          <input
                            required
                            type="text"
                            value={addressData.lastName}
                            onChange={(e) => {
                              setAddressData({ ...addressData, lastName: e.target.value });
                              if (fieldErrors.lastName) setFieldErrors(prev => {
                                const n = { ...prev };
                                delete n.lastName;
                                return n;
                              });
                            }}
                            className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.lastName ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                          />
                          {fieldErrors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.lastName}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">House / Flat / Area</label>
                        <input
                          required
                          type="text"
                          value={addressData.flatHouse}
                          onChange={(e) => {
                            setAddressData({ ...addressData, flatHouse: e.target.value });
                            if (fieldErrors.flatHouse) setFieldErrors(prev => {
                              const n = { ...prev };
                              delete n.flatHouse;
                              return n;
                            });
                          }}
                          className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.flatHouse ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                        />
                        {fieldErrors.flatHouse && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.flatHouse}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Landmark / Street</label>
                        <input
                          required
                          type="text"
                          value={addressData.areaStreet}
                          onChange={(e) => {
                            setAddressData({ ...addressData, areaStreet: e.target.value });
                            if (fieldErrors.areaStreet) setFieldErrors(prev => {
                              const n = { ...prev };
                              delete n.areaStreet;
                              return n;
                            });
                          }}
                          className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.areaStreet ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                        />
                        {fieldErrors.areaStreet && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.areaStreet}</p>}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">City</label>
                          <input
                            required
                            type="text"
                            value={addressData.city}
                            onChange={(e) => {
                              setAddressData({ ...addressData, city: e.target.value });
                              if (fieldErrors.city) setFieldErrors(prev => {
                                const n = { ...prev };
                                delete n.city;
                                return n;
                              });
                            }}
                            className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.city ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                          />
                          {fieldErrors.city && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.city}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">State</label>
                          <input
                            required
                            type="text"
                            value={addressData.state}
                            onChange={(e) => {
                              setAddressData({ ...addressData, state: e.target.value });
                              if (fieldErrors.state) setFieldErrors(prev => {
                                const n = { ...prev };
                                delete n.state;
                                return n;
                              });
                            }}
                            className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.state ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                          />
                          {fieldErrors.state && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.state}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">PIN</label>
                          <input
                            required
                            type="text"
                            value={addressData.pincode}
                            onChange={(e) => {
                              setAddressData({ ...addressData, pincode: e.target.value });
                              if (fieldErrors.pincode) setFieldErrors(prev => {
                                const n = { ...prev };
                                delete n.pincode;
                                return n;
                              });
                            }}
                            className={`w-full px-4 py-3 bg-cream/30 border ${fieldErrors.pincode ? 'border-red-500' : 'border-primary/10'} rounded-xl text-sm`}
                          />
                          {fieldErrors.pincode && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{fieldErrors.pincode}</p>}
                        </div>
                      </div>
                      <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Deliver Here"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* STEP: PAYMENT (Gateway List) */}
              {step === "PAYMENT" && (
                <div className="animate-fade-in flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal">Payment Method</h2>
                    <p className="text-sm text-charcoal/60 mt-1">Select your preferred way to pay.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {session?.paymentProviders?.map((gw: any) => (
                      <button
                        key={gw.name}
                        onClick={() => handleFinalize(gw.name)}
                        disabled={isLoading}
                        className="group flex items-center gap-4 p-4 border border-primary/10 rounded-2xl bg-cream/20 hover:bg-white hover:border-primary/40 hover:shadow-md transition-all text-left disabled:opacity-50"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl border border-primary/5 p-2 flex items-center justify-center shadow-sm">
                          <img src={gw.image} alt={gw.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-black text-charcoal">{gw.name}</h4>
                          <p className="text-[10px] text-charcoal/50 font-bold uppercase tracking-wider">{gw.description || gw.type}</p>
                        </div>
                        <ChevronRight className="text-charcoal/20 group-hover:text-primary transition-colors" size={20} />
                      </button>
                    ))}
                  </div>

                  {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

                  <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <Lock size={20} className="text-primary" />
                    <p className="text-[10px] font-bold text-charcoal/60 leading-relaxed uppercase tracking-wider">
                      Your transaction is encrypted and secured by industrial-grade protection.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP: REDIRECTING */}
              {step === "REDIRECTING" && (
                <div className="animate-fade-in flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-charcoal">Redirecting to Secure Payment</h2>
                  <p className="text-sm text-charcoal/60">Please do not refresh the page or click back.</p>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Order Summary (Persistent) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto p-2 -mx-2 scrollbar-hide">
                {session?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-cream/50 rounded-xl border border-primary/10 p-2 flex-shrink-0 flex items-center justify-center relative">
                      <span className="absolute -top-2.5 -right-2.5 bg-charcoal text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm z-10">
                        {item.quantity}
                      </span>
                      <img src={getMediaUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-charcoal line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                        {item.variantName || Object.values(item.options || {}).join(" / ") || "Standard"}
                      </span>
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
                  <span className="font-bold">₹{session?.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal/80">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold tracking-wide uppercase text-xs">Free</span>
                </div>
              </div>

              <div className="border-t border-primary/10 pt-4 mb-6 flex justify-between items-center">
                <span className="text-lg font-black uppercase tracking-wider text-charcoal/80">Total</span>
                <span className="text-2xl font-black text-charcoal">₹{session?.totalAmount?.toLocaleString()}</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">
                  <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                    100% Safe & Secure.
                  </p>
                </div>
                {session?.totalAmount && (
                  <div className="flex items-center gap-3 bg-primary/5 text-primary p-3 rounded-xl border border-primary/10">
                    <Gift size={20} className="text-primary flex-shrink-0" />
                    <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                      You earn <strong>{Math.floor(session.totalAmount / 10)} Coins</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
