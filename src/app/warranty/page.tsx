"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Calendar,
  Star,
  FileText,
  CheckCircle2,
  Upload,
  AlertCircle,
  Package,
} from "lucide-react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

// NOTE: This warranty form is UI-only. There is no upload pipeline or backend
// submission yet — submit() just synthesises a mock registration ID for preview.

interface WarrantyFormState {
  productCategory: string;
  modelNumber: string;
  serialNumber: string;
  purchaseDate: string;
  retailerName: string;
  invoiceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  address: string;
}

type FormErrors = Partial<Record<keyof WarrantyFormState, string>>;

const INITIAL_STATE: WarrantyFormState = {
  productCategory: "",
  modelNumber: "",
  serialNumber: "",
  purchaseDate: "",
  retailerName: "",
  invoiceNumber: "",
  fullName: "",
  email: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  address: "",
};

const PRODUCT_CATEGORIES = [
  "Mixer Grinder",
  "Air Cooler",
  "Ceiling Fan",
  "Heater",
  "Iron",
  "Other",
];

const REQUIRED_FIELDS: Array<keyof WarrantyFormState> = [
  "productCategory",
  "modelNumber",
  "serialNumber",
  "purchaseDate",
  "retailerName",
  "invoiceNumber",
  "fullName",
  "email",
  "phone",
  "pincode",
  "city",
  "state",
  "address",
];

export default function WarrantyPage() {
  const [form, setForm] = useState<WarrantyFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fileName, setFileName] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [registrationId, setRegistrationId] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof WarrantyFormState]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof WarrantyFormState];
        return next;
      });
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!form[key] || form[key].trim() === "") {
        next[key] = "This field is required.";
      }
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number.";
    }
    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode)) {
      next.pincode = "Pincode should be 6 digits.";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      const firstKey = Object.keys(next)[0];
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
      el?.focus();
      return;
    }
    // Mock registration ID: MS-WR- + 6-digit pad of timestamp
    const pad = String(Date.now()).slice(-6).padStart(6, "0");
    setRegistrationId(`MS-WR-${pad}`);
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
    setFileName("");
    setSubmitted(false);
    setRegistrationId("");
  };

  const benefits = [
    {
      icon: Calendar,
      title: "+1 Year Extended",
      body: "Register within 30 days of purchase and stretch coverage from 2 to 3 years.",
    },
    {
      icon: Star,
      title: "Priority Service",
      body: "Registered owners jump the queue — engineer visits within 48 hours of a request.",
    },
    {
      icon: FileText,
      title: "Digital Warranty Card",
      body: "No more lost paper receipts. Your card lives in your email and our records.",
    },
  ];

  const inputBase =
    "bg-cream/40 text-charcoal text-sm md:text-base px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-1 placeholder:text-charcoal/35 w-full transition-colors";
  const inputOk = "border-primary/15 focus:border-primary/50 focus:ring-primary/20";
  const inputErr = "border-primary/60 bg-primary/5 focus:border-primary focus:ring-primary/30";

  const fieldClass = (key: keyof WarrantyFormState) =>
    `${inputBase} ${errors[key] ? inputErr : inputOk}`;

  return (
    <div className="flex flex-col min-h-screen select-none bg-cream text-charcoal pb-14 sm:pb-0">
      <div className="sticky top-0 z-40 w-full select-none">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow">
        {/* Hero band */}
        <section className="py-20 md:py-28 max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-4 animate-fade-in">
            <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Warranty Registration
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.1]">
              Register Your Moonstruck Product
            </h1>
            <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-xl">
              Every Moonstruck appliance ships with a 2-year comprehensive warranty as standard.
              Register within 30 days of purchase and we&apos;ll add a complimentary third year on
              the house — no fine print, no add-on charges.
            </p>
          </div>
        </section>

        {/* Benefits strip */}
        {!submitted && (
          <section className="pb-12 max-w-4xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="bg-white border border-primary/10 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-black text-charcoal tracking-tight">
                      {b.title}
                    </h3>
                    <p className="text-xs md:text-sm text-charcoal/65 font-semibold leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Form OR Success card */}
        <section className="pb-12 max-w-3xl mx-auto px-4 md:px-6">
          {!submitted ? (
            <div className="bg-white border border-primary/10 rounded-2xl shadow-sm p-6 md:p-10 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/50">
                    Registration Form
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-charcoal tracking-tight">
                    Your Product & Details
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
                {/* Product details */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary border-b border-primary/10 pb-2">
                    Product Details
                  </span>

                  <Field label="Product Category" name="productCategory" error={errors.productCategory}>
                    <select
                      id="productCategory"
                      name="productCategory"
                      value={form.productCategory}
                      onChange={handleChange}
                      className={fieldClass("productCategory")}
                    >
                      <option value="">Select a category</option>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Model Number" name="modelNumber" error={errors.modelNumber}>
                      <input
                        id="modelNumber"
                        name="modelNumber"
                        type="text"
                        value={form.modelNumber}
                        onChange={handleChange}
                        placeholder="e.g., MS-MX750"
                        className={fieldClass("modelNumber")}
                      />
                    </Field>

                    <Field label="Serial Number" name="serialNumber" error={errors.serialNumber}>
                      <input
                        id="serialNumber"
                        name="serialNumber"
                        type="text"
                        value={form.serialNumber}
                        onChange={handleChange}
                        placeholder="e.g., SN24A11892"
                        className={fieldClass("serialNumber")}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Purchase Date" name="purchaseDate" error={errors.purchaseDate}>
                      <input
                        id="purchaseDate"
                        name="purchaseDate"
                        type="date"
                        value={form.purchaseDate}
                        onChange={handleChange}
                        className={fieldClass("purchaseDate")}
                      />
                    </Field>

                    <Field label="Invoice Number" name="invoiceNumber" error={errors.invoiceNumber}>
                      <input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        type="text"
                        value={form.invoiceNumber}
                        onChange={handleChange}
                        placeholder="e.g., INV-22841"
                        className={fieldClass("invoiceNumber")}
                      />
                    </Field>
                  </div>

                  <Field label="Retailer / Store Name" name="retailerName" error={errors.retailerName}>
                    <input
                      id="retailerName"
                      name="retailerName"
                      type="text"
                      value={form.retailerName}
                      onChange={handleChange}
                      placeholder="e.g., Croma, Reliance Digital, Moonstruck.co.in"
                      className={fieldClass("retailerName")}
                    />
                  </Field>
                </div>

                {/* Customer details */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary border-b border-primary/10 pb-2">
                    Customer Details
                  </span>

                  <Field label="Full Name" name="fullName" error={errors.fullName}>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="As on the invoice"
                      className={fieldClass("fullName")}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email" name="email" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className={fieldClass("email")}
                      />
                    </Field>

                    <Field label="Phone" name="phone" error={errors.phone}>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98xxx xxxxx"
                        className={fieldClass("phone")}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Pincode" name="pincode" error={errors.pincode}>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        inputMode="numeric"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        maxLength={6}
                        className={fieldClass("pincode")}
                      />
                    </Field>

                    <Field label="City" name="city" error={errors.city}>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className={fieldClass("city")}
                      />
                    </Field>

                    <Field label="State" name="state" error={errors.state}>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        className={fieldClass("state")}
                      />
                    </Field>
                  </div>

                  <Field label="Full Address" name="address" error={errors.address}>
                    <textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="House / Flat no., street, locality, landmark"
                      className={fieldClass("address")}
                    />
                  </Field>
                </div>

                {/* Optional invoice upload */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/60">
                    Invoice Copy <span className="text-charcoal/35 normal-case">(Optional)</span>
                  </span>
                  <label
                    htmlFor="invoice-file"
                    className="cursor-pointer flex items-center justify-between gap-3 bg-cream/40 border border-dashed border-primary/30 rounded-xl px-5 py-4 hover:bg-primary/5 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                        <Upload size={16} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-charcoal">
                          {fileName || "Attach invoice (PDF, JPG, PNG)"}
                        </span>
                        <span className="text-[11px] text-charcoal/50 font-semibold">
                          Speeds up verification. Up to 10MB.
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      Browse
                    </span>
                    <input
                      id="invoice-file"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFile}
                      className="sr-only"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full text-center bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
                >
                  Register My Warranty
                </button>

                <span className="text-[10px] text-charcoal/40 font-bold tracking-wide text-center">
                  By submitting, you confirm the details are accurate. False entries may void coverage.
                </span>
              </form>
            </div>
          ) : (
            // Success state
            <div className="bg-white border border-forest/20 rounded-2xl shadow-sm p-8 md:p-12 animate-fade-in flex flex-col items-center text-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-forest/10 border border-forest/25 flex items-center justify-center">
                <CheckCircle2 size={42} className="text-forest" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-forest">
                  Confirmed
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.1]">
                  Warranty registered
                </h2>
              </div>
              <div className="bg-cream/60 border border-primary/10 rounded-xl px-6 py-4 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/50">
                  Registration ID
                </span>
                <span className="text-2xl md:text-3xl font-black text-charcoal tracking-tight mt-1">
                  {registrationId}
                </span>
              </div>
              <div className="text-sm md:text-base text-charcoal/70 font-semibold leading-relaxed max-w-md flex flex-col gap-3">
                <p>
                  Your digital warranty card is being emailed to{" "}
                  <span className="text-charcoal font-black">{form.email}</span> right now — keep an
                  eye on your inbox over the next 10 minutes.
                </p>
                <p>
                  Save the registration ID above. You&apos;ll need it whenever you raise a service
                  request, and it&apos;s the fastest way for our team to identify your unit.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleReset}
                  className="bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base px-8 py-3.5 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
                >
                  Register Another Product
                </button>
                <a
                  href="/"
                  className="bg-white text-charcoal hover:text-primary border border-charcoal/15 hover:border-primary/40 font-black text-sm md:text-base px-8 py-3.5 rounded-xl cursor-pointer transition-all"
                >
                  Back to Home
                </a>
              </div>
            </div>
          )}
        </section>

        {/* FAQ teaser */}
        <section className="py-20 md:py-28 max-w-3xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-start gap-3 mb-8 animate-fade-in">
            <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Common Questions
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.15]">
              Before you ask
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <FaqItem
              question="What's covered under the standard warranty?"
              answer="Manufacturing defects, motor and PCB failures, heating-element burnouts, and any malfunction not caused by misuse, voltage spikes, or unauthorised repairs. Cosmetic wear, accessories like jars and blades after 6 months, and consumables are not covered."
            />
            <FaqItem
              question="How long does registration take to process?"
              answer="The digital warranty card is auto-generated and emailed within 10 minutes. If you attached an invoice, a human reviewer cross-checks it within one working day — you'll receive a confirmation either way."
            />
            <FaqItem
              question="Can I transfer warranty to a new owner?"
              answer="Yes. Write to care@moonstruck.co.in with your registration ID, the new owner's details, and a photo of the original invoice. We'll re-issue the digital card in their name within 48 hours. The coverage period stays tied to the original purchase date."
            />
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}

/* ----- Helpers ----- */

interface FieldProps {
  label: string;
  name: keyof WarrantyFormState;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, name, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[10px] md:text-xs font-black uppercase tracking-widest text-charcoal/60"
      >
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[11px] text-primary font-bold flex items-center gap-1.5">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

interface FaqItemProps {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group bg-white border border-primary/10 rounded-2xl shadow-sm overflow-hidden transition-all">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-cream/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-primary" />
          </div>
          <h3 className="text-sm md:text-base font-black text-charcoal tracking-tight">
            {question}
          </h3>
        </div>
        <span className="text-primary text-2xl font-black leading-none transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1 text-xs md:text-sm text-charcoal/70 font-semibold leading-relaxed border-t border-primary/10">
        {answer}
      </div>
    </details>
  );
}
