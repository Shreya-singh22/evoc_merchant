"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

const createOrderSchema = z.object({
  userId: z.string(),
  items: z.array(z.any()),
  totalAmount: z.number().positive(),
  paymentMethod: z.string().optional(),
  payuTxnId: z.string().optional(),
  payuStatus: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
});

type CreateOrderResult =
  | { success: true; data: Awaited<ReturnType<typeof prisma.order.create>> }
  | { success: false; message: string };

export async function createOrder(data: unknown): Promise<CreateOrderResult> {
  const validated = createOrderSchema.parse(data);

  const order = await prisma.order.create({
    data: {
      userId: validated.userId,
      items: validated.items as any,
      totalAmount: validated.totalAmount,
      status: validated.paymentMethod === "COD" ? "COD_CONFIRMED" : "PENDING",
      paymentMethod: validated.paymentMethod,
      payuTxnId: validated.payuTxnId,
      payuStatus: validated.payuStatus,
      firstName: validated.firstName,
      lastName: validated.lastName,
      email: validated.email,
    },
  });

  // Sync to backend dashboard (Orbit-360 / backend)
  try {
    const backendPayload = {
      items: validated.items.map((i: any) => ({
        id: i.id || i.productId,
        name: i.title || i.name || "Product",
        quantity: i.quantity || 1,
        price: i.price || 0,
      })),
      customer: {
        firstName: validated.firstName || "Guest",
        lastName: validated.lastName || "User",
        email: validated.email || "guest@example.com",
      },
      total: validated.totalAmount,
      paymentMethod: validated.paymentMethod === "COD" ? "cod" : (validated.paymentMethod || "cod").toLowerCase(),
    };
    
    await fetch("http://localhost:5002/api/storefront/public/moonstruck/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload)
    });
  } catch (err) {
    console.error("Failed to sync order to backend dashboard", err);
  }

  return { success: true, data: order };
}

type GetOrderResult =
  | { success: true; data: Awaited<ReturnType<typeof prisma.order.findUnique>> }
  | { success: false; message: string };

export async function getOrder(orderId: string): Promise<GetOrderResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          phone: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!order) {
    return { success: false, message: "Order not found" };
  }

  return { success: true, data: order };
}

type GetUserOrdersResult =
  | { success: true; data: Awaited<ReturnType<typeof prisma.order.findMany>> }
  | { success: false; message: string };

export async function getUserOrders(userId: string): Promise<GetUserOrdersResult> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, data: orders };
}

const updateOrderSchema = z.object({
  status: z.string().optional(),
  payuTxnId: z.string().optional(),
  payuStatus: z.string().optional(),
});

type UpdateOrderResult =
  | { success: true; data: Awaited<ReturnType<typeof prisma.order.update>> }
  | { success: false; message: string };

export async function updateOrder(orderId: string, data: unknown): Promise<UpdateOrderResult> {
  const validated = updateOrderSchema.parse(data);

  const order = await prisma.order.update({
    where: { id: orderId },
    data: validated,
  });

  return { success: true, data: order };
}