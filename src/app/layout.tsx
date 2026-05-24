import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import "@/lib/env-validation";

export const metadata: Metadata = {
  title: "Premium Home Appliances | High Performance & Reliability",
  description: "Explore our story-driven collection of precision-engineered home appliances. Quality and durability built for your home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";
  const payuScriptUrl = isDev
    ? "https://jssdk-uat.payu.in/bolt/bolt.min.js"
    : "https://jssdk.payu.in/bolt/bolt.min.js";

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-charcoal" suppressHydrationWarning>
        <Script
          src={payuScriptUrl}
          strategy="beforeInteractive"
          id="payu-bolt"
        />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
