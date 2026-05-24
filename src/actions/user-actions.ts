"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

const userSchema = z.object({
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function getOrCreateUser(data: unknown) {
  const validated = userSchema.parse(data);

  let user = await prisma.user.findUnique({
    where: { phone: validated.phone },
    include: {
      addresses: {
        orderBy: { isDefault: "desc" },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    const createdUser = await prisma.user.create({
      data: {
        phone: validated.phone,
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
      },
    });
    return {
      success: true,
      data: {
        id: createdUser.id,
        phone: createdUser.phone,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        isVerified: createdUser.isVerified,
        addresses: [],
        orders: [],
      },
    };
  }

  return {
    success: true,
    data: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      addresses: user.addresses.map((a) => ({
        id: a.id,
        type: a.type,
        flatHouse: a.flatHouse,
        areaStreet: a.areaStreet,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        phone: a.phone,
        isDefault: a.isDefault,
      })),
      orders: user.orders.map((o) => ({
        id: o.id,
        items: o.items,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentMethod: o.paymentMethod,
        payuTxnId: o.payuTxnId,
        payuStatus: o.payuStatus,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
    },
  };
}

export async function getUserByPhone(phone: string) {
  const user = await prisma.user.findUnique({
    where: { phone },
    include: {
      addresses: {
        orderBy: { isDefault: "desc" },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return {
    success: true,
    data: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      addresses: user.addresses.map((a) => ({
        id: a.id,
        type: a.type,
        flatHouse: a.flatHouse,
        areaStreet: a.areaStreet,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        phone: a.phone,
        isDefault: a.isDefault,
      })),
      orders: user.orders.map((o) => ({
        id: o.id,
        items: o.items,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentMethod: o.paymentMethod,
        payuTxnId: o.payuTxnId,
        payuStatus: o.payuStatus,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
    },
  };
}

export type UserData = {
  id: string;
  phone: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isVerified: boolean;
  addresses: AddressData[];
  orders: OrderData[];
};

export type AddressData = {
  id: string;
  type: string;
  flatHouse: string;
  areaStreet: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string | null;
  isDefault: boolean;
};

export type OrderData = {
  id: string;
  items: unknown;
  totalAmount: number;
  status: string;
  paymentMethod?: string | null;
  payuTxnId?: string | null;
  payuStatus?: string | null;
  createdAt: Date;
  updatedAt: Date;
};