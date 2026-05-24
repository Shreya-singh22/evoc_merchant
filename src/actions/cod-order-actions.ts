"use server";

import { createOrder } from "@/actions/order-actions";

export async function createCodOrder(data: {
  userId: string;
  items: any[];
  totalAmount: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  customerPhone?: string;
  shippingAddress?: {
    flatHouse: string;
    areaStreet: string;
    city: string;
    state: string;
    pincode: string;
  };
}) {
  // Create local order
  const orderResult = await createOrder({
    userId: data.userId,
    items: JSON.parse(JSON.stringify(data.items)), // Ensure proper serialization
    totalAmount: data.totalAmount,
    paymentMethod: "COD",
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  });

  if (!orderResult.success) {
    return { success: false, message: orderResult.message };
  }

  // Post to external API
  const storeId = process.env.STORE_ID;
  if (storeId && data.shippingAddress) {
    const customerName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Customer";

    const externalPayload = {
      storeId,
      customerName,
      customerEmail: data.email || "",
      shippingAddress: JSON.stringify({
        street: `${data.shippingAddress.flatHouse}, ${data.shippingAddress.areaStreet}`,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        zipCode: data.shippingAddress.pincode,
      }),
      billingAddress: JSON.stringify({
        street: `${data.shippingAddress.flatHouse}, ${data.shippingAddress.areaStreet}`,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        zipCode: data.shippingAddress.pincode,
      }),
      subtotal: data.totalAmount,
      total: data.totalAmount,
      shipping: 0,
      tax: 0,
      items: data.items.map((item) => ({
        productId: item.productId || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await fetch("https://api.evoclabs.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(externalPayload),
      });
    } catch (err) {
      console.error("External API error:", err);
    }
  }

  return { success: true, orderId: String(orderResult.data.id) };
}