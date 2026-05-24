"use client";

import React, { useState, useRef } from "react";
import { CreditCard, Lock, AlertCircle, Loader2 } from "lucide-react";
import { createOrder, updateOrder, getPayUHash, getPayUKey } from "@/actions";

interface PayUResponse {
  response?: {
    status: string;
    txnStatus?: string;
    txnid?: string;
    mihpayid?: string;
    error_Message?: string;
    mode?: string;
    bankcode?: string;
  };
  status?: string;
  txnid?: string;
  mihpayid?: string;
  error_Message?: string;
  mode?: string;
  bankcode?: string;
}

interface OnlinePaymentProps {
  onSuccess: (orderId: string) => void;
  onFailure: () => void;
  onCancel: () => void;
  userId: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
  totalAmount: number;
}

declare global {
  interface Window {
    bolt?: {
      launch: (data: Record<string, string>, handlers: {
        responseHandler: (response: PayUResponse) => void;
        catchException: (error: Error) => void;
      }) => void;
    };
  }
}

export default function OnlinePayment({
  onSuccess,
  onFailure,
  onCancel,
  userId,
  customerFirstName,
  customerLastName,
  customerEmail,
  customerPhone,
  items,
  totalAmount,
}: OnlinePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const launchAttemptedRef = useRef(false);

  const handlePayNow = async () => {
    if (launchAttemptedRef.current) return;
    launchAttemptedRef.current = true;

    setIsProcessing(true);
    setError(null);

    if (!window.bolt) {
      setError("Payment gateway is initializing. Please try again.");
      launchAttemptedRef.current = false;
      setIsProcessing(false);
      return;
    }

    const baseUrl = window.location.origin;

    try {
      const { key: merchantKey } = await getPayUKey();

      if (!merchantKey) {
        setError("Payment configuration error. Please contact support.");
        launchAttemptedRef.current = false;
        setIsProcessing(false);
        return;
      }

      const orderResult = await createOrder({
        userId,
        items,
        totalAmount,
        paymentMethod: "PAYU",
        firstName: customerFirstName,
        lastName: customerLastName,
        email: customerEmail,
      });

      if (!orderResult.success) throw new Error("Failed to create order");

      // Use the actual order ID returned from DB for PayU transaction
      const orderId = orderResult.data.id;

      const formattedAmount = totalAmount.toFixed(2);

      const hashData = {
        key: merchantKey,
        txnid: orderId,
        amount: formattedAmount,
        productinfo: `Order${orderId}`,
        firstname: customerFirstName,
        lastname: customerLastName,
        email: customerEmail || "",
        phone: customerPhone || "",
        udf1: userId,
        udf2: orderId,
      };

      const { hash } = await getPayUHash(hashData);

      const payuData: Record<string, string> = {
        key: merchantKey,
        txnid: orderId,
        amount: formattedAmount,
        productinfo: `Order${orderId}`,
        firstname: customerFirstName,
        lastname: customerLastName,
        email: customerEmail || "",
        phone: customerPhone || "",
        udf1: userId,
        udf2: orderId,
        udf3: "",
        udf4: "",
        udf5: "",
        hash: hash,
        surl: `${baseUrl}/api/payu/callback`,
        furl: `${baseUrl}/api/payu/callback`,
      };

      window.bolt.launch(payuData, {
        responseHandler: async (boltResponse: PayUResponse) => {
          console.log("Raw PayU Response:", boltResponse);

          // Immediately clear processing state for better UX
          setIsProcessing(false);

          // Extract the nested response object (PayU Bolt nests it under .response)
          const res = boltResponse.response;

          // Check for success using both 'status' and 'txnStatus' for compatibility
          if (res && (res.status === "success" || res.txnStatus === "SUCCESS")) {
            console.log("Payment successful, updating order...");
            // Update order in background (don't await for better UX)
            updateOrder(orderId, {
              status: "PAID",
              payuTxnId: res.mihpayid || "",
              payuStatus: "success",
            }).catch(console.error);
            onSuccess(orderId);
          } else {
            console.warn("Payment failed or cancelled:", res);
            updateOrder(orderId, {
              status: "FAILED",
              payuStatus: "failure",
            }).catch(console.error);
            setError(res?.error_Message || "Payment failed or was cancelled.");
            onFailure();
          }

          launchAttemptedRef.current = false;
        },
        catchException: (err: Error) => {
          console.error("PayU Exception:", err);
          setError("Payment modal closed or failed to load.");
          onFailure();
          launchAttemptedRef.current = false;
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setError(err.message || "Initialization failed.");
      onFailure();
      launchAttemptedRef.current = false;
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-black text-charcoal">Online Payment</h4>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed text-pretty">
              Pay securely via PayU. We accept all major cards, UPI, net banking, and wallets.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-green-50 text-green-800 p-3 rounded-xl border border-green-200">
        <Lock size={16} className="text-green-600 flex-shrink-0" />
        <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
          256-bit SSL Encrypted Payment
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-black text-sm py-4 rounded-xl cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Redirecting to Payment...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Pay Now - ₹{totalAmount.toLocaleString()}
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full bg-white border border-primary/10 text-charcoal font-bold text-sm py-3 rounded-xl cursor-pointer hover:bg-cream transition-all disabled:opacity-50"
        >
          Choose Different Payment
        </button>
      </div>
    </div>
  );
}