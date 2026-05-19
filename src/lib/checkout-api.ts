
const CHECKOUT_API_BASE_URL = "https://api.evoclabs.com/api/v1";
const STORE_ID = "store_123";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    "x-store-id": STORE_ID,
    ...options.headers,
  };

  const response = await fetch(`${CHECKOUT_API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Checkout API Error");
  }

  return data;
}

export const checkoutApi = {
  // 1. Initialize the session with items
  initSession: (items: any[], successUrl?: string, cancelUrl?: string) => {
    return request<any>("/checkout/init", {
      method: "POST",
      body: JSON.stringify({
        items,
        currency: "INR",
        successUrl,
        cancelUrl,
      }),
    });
  },

  // 2. Start Auth: Send OTP
  sendOtp: (phone: string, sessionId: string) => {
    return request<any>("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone, sessionId }),
    });
  },

  // 3. Complete Auth: Verify OTP
  verifyOtp: (phone: string, code: string, sessionId: string) => {
    return request<any>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code, sessionId }),
    });
  },

  // 4. Set Profile/Address (Post-Auth)
  updateProfile: (sessionId: string, payload: { email: string; phone: string; newAddress: any }) => {
    return request<any>("/user/profile", {
      method: "POST",
      body: JSON.stringify({ sessionId, ...payload }),
    });
  },

  // 5. Fetch Session State (to see current progress and enabled gateways)
  getSummary: (sessionId: string) => {
    return request<any>(`/checkout/summary/${sessionId}`, {
      method: "GET",
    });
  },

  // 6. Finalize and trigger Payment Intent
  finalize: (sessionId: string, paymentMethod: string) => {
    return request<any>("/checkout/finalize", {
      method: "POST",
      body: JSON.stringify({ sessionId, paymentMethod }),
    });
  },
};
