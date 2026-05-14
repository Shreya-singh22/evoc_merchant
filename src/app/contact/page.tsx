"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  Handshake,
  MapPin,
  Clock,
  Headphones,
  Send,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Building2,
} from "lucide-react";

import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

type SubjectKey =
  | "Product Question"
  | "Order Help"
  | "Service Request"
  | "Warranty Claim"
  | "Partnership"
  | "Other";

interface ContactFormState {
  fullName: string;
  email: string;
  phone: string;
  subject: SubjectKey | "";
  orderNumber: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const SUBJECT_OPTIONS: SubjectKey[] = [
  "Product Question",
  "Order Help",
  "Service Request",
  "Warranty Claim",
  "Partnership",
  "Other",
];

interface ChannelCard {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  value: string;
  href: string;
  secondary: string;
  badge: string;
}

const CHANNELS: ChannelCard[] = [
  {
    icon: <Phone size={22} className="text-primary" />,
    eyebrow: "Toll Free",
    title: "Call our helpline",
    value: "+91 1800-200-1122",
    href: "tel:+918001001122",
    secondary: "Mon to Sat, 9 AM – 7 PM IST",
    badge: "Fastest",
  },
  {
    icon: <MessageCircle size={22} className="text-forest" />,
    eyebrow: "WhatsApp",
    title: "Chat in two taps",
    value: "+91 98200 01122",
    href: "https://wa.me/919820001122",
    secondary: "Replies in under 15 minutes",
    badge: "24x7 Bot",
  },
  {
    icon: <Mail size={22} className="text-primary" />,
    eyebrow: "Customer Care",
    title: "Email support team",
    value: "care@moonstruck.co.in",
    href: "mailto:care@moonstruck.co.in",
    secondary: "Answered within 4 working hours",
    badge: "Verified",
  },
  {
    icon: <Handshake size={22} className="text-gold" />,
    eyebrow: "Business",
    title: "Bulk & partnerships",
    value: "sales@moonstruck.co.in",
    href: "mailto:sales@moonstruck.co.in",
    secondary: "B2B, distributor & gifting enquiries",
    badge: "B2B",
  },
];

interface ServiceCenter {
  city: string;
  region: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
}

const SERVICE_CENTERS: ServiceCenter[] = [
  {
    city: "Mumbai",
    region: "Western HQ",
    address:
      "Ground Floor, 104 Industrial Area, Phase II, Andheri East, Mumbai 400072",
    phone: "+91 22 4815 2200",
    phoneHref: "tel:+912248152200",
    hours: "Walk-in: Mon–Sat, 10 AM – 6:30 PM",
  },
  {
    city: "Delhi NCR",
    region: "Northern Hub",
    address:
      "B-22, Okhla Industrial Estate, Phase II, New Delhi 110020",
    phone: "+91 11 4708 1122",
    phoneHref: "tel:+911147081122",
    hours: "Walk-in: Mon–Sat, 10 AM – 7 PM",
  },
  {
    city: "Bangalore",
    region: "Southern Hub",
    address:
      "No. 47, 2nd Floor, 100 Feet Road, Indiranagar, Bengaluru 560038",
    phone: "+91 80 4096 2200",
    phoneHref: "tel:+918040962200",
    hours: "Walk-in: Tue–Sun, 11 AM – 7 PM",
  },
];

const BUSINESS_HOURS: Array<{ day: string; hours: string; note?: string }> = [
  { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 5:00 PM" },
  { day: "Sunday", hours: "Closed", note: "WhatsApp bot remains active" },
  { day: "National Holidays", hours: "Closed" },
];

const INITIAL_FORM: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  orderNumber: "",
  message: "",
};

// NOTE: This contact form is UI-only. No backend wiring — the submit handler
// performs client-side validation and then renders an inline success state.
// When the API endpoint is ready, replace the `handleSubmit` setTimeout with
// the real POST to /api/contact (or wherever it ends up living).

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (state: ContactFormState): FormErrors => {
    const next: FormErrors = {};
    if (!state.fullName.trim()) next.fullName = "Please tell us your name.";
    if (!state.email.trim()) {
      next.email = "We'll need an email to reply.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      next.email = "That email doesn't look right.";
    }
    if (!state.phone.trim()) {
      next.phone = "A phone number helps us respond faster.";
    } else if (state.phone.replace(/\D/g, "").length < 7) {
      next.phone = "Please enter a valid phone number.";
    }
    if (!state.subject) next.subject = "Pick what your message is about.";
    if (!state.message.trim()) {
      next.message = "Add a short note so we can help properly.";
    } else if (state.message.trim().length < 12) {
      next.message = "A few more words please — at least 12 characters.";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Simulate a request roundtrip; replace with real API call when wired.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  };

  const inputBase =
    "w-full bg-white text-charcoal text-sm md:text-base px-4 py-3.5 rounded-xl border border-primary/15 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 shadow-sm transition-all placeholder:text-charcoal/30";
  const inputError =
    "border-primary/60 focus:border-primary focus:ring-primary/25";

  return (
    <div className="flex flex-col min-h-screen select-none bg-cream text-charcoal pb-14 sm:pb-0">
      <div className="sticky top-0 z-40 w-full select-none">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow">
        {/* 1. HERO BAND */}
        <section className="relative overflow-hidden bg-cream/40 border-b border-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(#C8102E_0.6px,transparent_0.6px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 relative">
            <div className="max-w-3xl flex flex-col gap-5 animate-fade-in">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Get In Touch
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-charcoal tracking-tight leading-[1.05]">
                We&apos;re here to help, every step of the way.
              </h1>
              <p className="text-charcoal/70 text-base md:text-lg leading-relaxed max-w-2xl">
                Whether it&apos;s a question before you buy, a service visit for your
                Moonstruck appliance, or a partnership idea — talk to a real
                person. Most queries are answered within{" "}
                <strong className="text-charcoal">4 working hours</strong>, and
                no call gets passed around more than twice. That&apos;s our promise.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <a
                  href="tel:+918001001122"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-sm px-6 py-3.5 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
                >
                  <Phone size={16} /> Call 1800-200-1122
                </a>
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 bg-white text-charcoal border border-charcoal/15 hover:border-primary hover:text-primary font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer hover:shadow-sm"
                >
                  Write to us <ArrowRight size={16} />
                </a>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-forest bg-forest/10 border border-forest/20 px-3 py-2 rounded-full">
                  <ShieldCheck size={14} /> ISO 9001 certified service
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CHANNEL CARDS GRID */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-2 mb-12 max-w-xl">
            <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Talk to us your way
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
              Four direct lines, zero queues.
            </h2>
            <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
              Pick the channel that suits you. Every message is logged against
              your customer file, so you never have to repeat yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in">
            {CHANNELS.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  c.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 p-6 md:p-7 flex flex-col gap-4 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-gold/15 text-charcoal/80 text-[9px] font-black px-2 py-1 uppercase rounded-full tracking-wider border border-gold/30">
                    {c.badge}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {c.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-charcoal/40">
                    {c.eyebrow}
                  </span>
                  <h3 className="text-lg font-black text-charcoal leading-tight group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                </div>
                <div className="border-t border-primary/10 pt-3 mt-auto flex flex-col gap-1">
                  <span className="text-sm font-black text-charcoal break-all">
                    {c.value}
                  </span>
                  <span className="text-xs text-charcoal/60 font-semibold leading-relaxed">
                    {c.secondary}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 3. FORM + ADDRESS SPLIT */}
        <section
          id="contact-form"
          className="py-20 md:py-28 bg-white border-y border-primary/10"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* LEFT — FORM */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Write to us
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight leading-[1.1]">
                  Send a message, get a real reply.
                </h2>
                <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
                  Fill in the form below. A trained Moonstruck advisor — not a
                  bot — will get back to you, usually the same business day.
                </p>
              </div>

              {submitted ? (
                <div className="bg-cream/60 border border-forest/20 rounded-2xl p-8 md:p-10 flex flex-col gap-4 animate-fade-in shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center">
                    <ShieldCheck size={28} className="text-forest" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl md:text-3xl font-black text-charcoal tracking-tight leading-tight">
                      Message received. Thank you.
                    </h3>
                    <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
                      A confirmation has been sent to{" "}
                      <strong className="text-charcoal">
                        {form.email || "your email"}
                      </strong>
                      . You&apos;ll hear from a Moonstruck advisor within{" "}
                      <strong className="text-charcoal">4 working hours</strong>
                      . For anything urgent, call{" "}
                      <a
                        href="tel:+918001001122"
                        className="text-primary font-black underline underline-offset-2"
                      >
                        1800-200-1122
                      </a>
                      .
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white font-black text-sm px-5 py-3 rounded-xl cursor-pointer hover:shadow-md transition-all"
                    >
                      Send another message
                    </button>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-white text-charcoal border border-charcoal/15 hover:border-primary hover:text-primary font-bold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Back to home <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                  aria-label="Contact Moonstruck Appliances"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="fullName"
                        className="text-[10px] font-black tracking-widest uppercase text-charcoal/60"
                      >
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Priya Sharma"
                        value={form.fullName}
                        onChange={(e) =>
                          updateField("fullName", e.target.value)
                        }
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={
                          errors.fullName ? "fullName-error" : undefined
                        }
                        className={`${inputBase} ${
                          errors.fullName ? inputError : ""
                        }`}
                      />
                      {errors.fullName && (
                        <span
                          id="fullName-error"
                          className="text-xs text-primary font-bold flex items-center gap-1.5 mt-0.5"
                        >
                          <AlertCircle size={12} /> {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-[10px] font-black tracking-widest uppercase text-charcoal/60"
                      >
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        className={`${inputBase} ${
                          errors.email ? inputError : ""
                        }`}
                      />
                      {errors.email && (
                        <span
                          id="email-error"
                          className="text-xs text-primary font-bold flex items-center gap-1.5 mt-0.5"
                        >
                          <AlertCircle size={12} /> {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="phone"
                        className="text-[10px] font-black tracking-widest uppercase text-charcoal/60"
                      >
                        Phone <span className="text-primary">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98XXX XXXXX"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={
                          errors.phone ? "phone-error" : undefined
                        }
                        className={`${inputBase} ${
                          errors.phone ? inputError : ""
                        }`}
                      />
                      {errors.phone && (
                        <span
                          id="phone-error"
                          className="text-xs text-primary font-bold flex items-center gap-1.5 mt-0.5"
                        >
                          <AlertCircle size={12} /> {errors.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="subject"
                        className="text-[10px] font-black tracking-widest uppercase text-charcoal/60"
                      >
                        Subject <span className="text-primary">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={(e) =>
                          updateField(
                            "subject",
                            e.target.value as ContactFormState["subject"]
                          )
                        }
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={
                          errors.subject ? "subject-error" : undefined
                        }
                        className={`${inputBase} ${
                          errors.subject ? inputError : ""
                        } appearance-none cursor-pointer`}
                      >
                        <option value="">What is this about?</option>
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <span
                          id="subject-error"
                          className="text-xs text-primary font-bold flex items-center gap-1.5 mt-0.5"
                        >
                          <AlertCircle size={12} /> {errors.subject}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="orderNumber"
                      className="text-[10px] font-black tracking-widest uppercase text-charcoal/60 flex items-center gap-2"
                    >
                      Order Number{" "}
                      <span className="text-charcoal/30 font-bold normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="orderNumber"
                      name="orderNumber"
                      type="text"
                      placeholder="e.g. MS-2026-039422"
                      value={form.orderNumber}
                      onChange={(e) =>
                        updateField("orderNumber", e.target.value)
                      }
                      className={inputBase}
                    />
                    <span className="text-[11px] text-charcoal/45 font-semibold">
                      Sharing this helps us pull up your records straight away.
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-[10px] font-black tracking-widest uppercase text-charcoal/60"
                    >
                      Your Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell us what's on your mind — product specs, an installation question, a service follow-up. The more detail, the faster the fix."
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      className={`${inputBase} resize-y ${
                        errors.message ? inputError : ""
                      }`}
                    />
                    {errors.message && (
                      <span
                        id="message-error"
                        className="text-xs text-primary font-bold flex items-center gap-1.5 mt-0.5"
                      >
                        <AlertCircle size={12} /> {errors.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-charcoal/45 font-semibold leading-relaxed max-w-xs">
                      By submitting, you agree to our privacy policy. We never
                      share your details with third parties.
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base px-8 py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md disabled:opacity-60 disabled:cursor-wait flex-shrink-0"
                    >
                      <Send size={16} />
                      {submitting ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT — ADDRESS, MAP, HOURS */}
            <div className="flex flex-col gap-6">
              {/* Address block */}
              <div className="bg-cream/50 border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                    <Building2 size={22} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black tracking-widest uppercase text-charcoal/50">
                      Registered Office
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-charcoal leading-tight">
                      Moonstruck Appliances Pvt. Ltd.
                    </h3>
                    <p className="text-sm text-charcoal/70 leading-relaxed mt-1">
                      104, Industrial Area Phase II,
                      <br />
                      Andheri East, Mumbai,
                      <br />
                      Maharashtra 400072, India
                    </p>
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Andheri+East+Mumbai+400072"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-charcoal border border-charcoal/15 hover:border-primary hover:text-primary font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer hover:shadow-sm"
                  >
                    <MapPin size={14} /> Get Directions
                  </a>
                  <a
                    href="tel:+912248152200"
                    className="inline-flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer hover:shadow-sm"
                  >
                    <Phone size={14} /> +91 22 4815 2200
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="relative bg-charcoal/5 aspect-square md:aspect-[4/3] rounded-2xl border border-primary/10 overflow-hidden group">
                <iframe
                  title="Moonstruck Appliances HQ — Mumbai"
                  src="https://www.google.com/maps?q=Andheri+East,Mumbai,Maharashtra+400072&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale-[35%] group-hover:grayscale-0 transition-all"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-primary/15 rounded-xl px-4 py-3 shadow-md flex items-center gap-3 pointer-events-none">
                  <MapPin size={18} className="text-primary flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest uppercase text-charcoal/50">
                      HQ Pin
                    </span>
                    <span className="text-sm font-black text-charcoal leading-tight">
                      Mumbai, Maharashtra
                    </span>
                  </div>
                </div>
              </div>

              {/* Business hours */}
              <div className="bg-white border border-primary/10 rounded-2xl p-6 md:p-7 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-charcoal" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest uppercase text-charcoal/50">
                      Working Hours
                    </span>
                    <h3 className="text-lg font-black text-charcoal leading-tight">
                      When we&apos;re live (IST)
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col divide-y divide-primary/10">
                  {BUSINESS_HOURS.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-charcoal">
                          {row.day}
                        </span>
                        {row.note && (
                          <span className="text-[11px] text-charcoal/50 font-semibold">
                            {row.note}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          row.hours === "Closed"
                            ? "text-primary"
                            : "text-charcoal/80"
                        }`}
                      >
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SERVICE CENTERS */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl flex flex-col gap-2">
              <span className="text-primary text-xs md:text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Walk-In Hubs
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">
                Drop by a service centre.
              </h2>
              <p className="text-charcoal/70 text-sm md:text-base leading-relaxed">
                Genuine spares, certified engineers, and zero appointment-only
                gatekeeping. Three flagship hubs across India — more rolling out
                through 2026.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white text-charcoal border border-charcoal/15 hover:border-primary hover:text-primary font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer hover:shadow-sm self-start md:self-end"
            >
              See full network <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
            {SERVICE_CENTERS.map((s) => (
              <div
                key={s.city}
                className="bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 p-6 md:p-7 flex flex-col gap-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest uppercase text-charcoal/40">
                      {s.region}
                    </span>
                    <h3 className="text-2xl font-black text-charcoal leading-tight group-hover:text-primary transition-colors">
                      {s.city}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <Headphones size={18} className="text-primary" />
                  </div>
                </div>

                <p className="text-sm text-charcoal/70 leading-relaxed">
                  {s.address}
                </p>

                <div className="border-t border-primary/10 pt-4 flex flex-col gap-2">
                  <a
                    href={s.phoneHref}
                    className="text-sm font-black text-charcoal hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Phone size={14} className="text-primary" /> {s.phone}
                  </a>
                  <span className="text-xs text-charcoal/60 font-semibold flex items-center gap-2">
                    <Clock size={13} className="text-charcoal/40" /> {s.hours}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    s.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-2 bg-cream/60 hover:bg-primary hover:text-white text-charcoal border border-primary/15 hover:border-primary font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer"
                >
                  <MapPin size={13} /> View on map
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FAQ TEASER */}
        <section className="pb-20 md:pb-28 max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-charcoal text-white rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#C9A86A_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />
            <div className="flex flex-col gap-3 relative z-10 max-w-xl">
              <span className="text-gold text-[10px] md:text-xs font-black tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Before you write
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
                Most answers live in our FAQ.
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Warranty terms, delivery timelines, EMI, installation — the
                quick stuff is already documented. Skim it first; you might save
                yourself the wait.
              </p>
            </div>
            <Link
              href="/#faq"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-black text-sm md:text-base px-7 py-4 rounded-xl cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md flex-shrink-0 relative z-10"
            >
              Browse the FAQ <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
