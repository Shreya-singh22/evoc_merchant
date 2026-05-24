"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const addressSchema = z.object({
  userId: z.string(),
  type: z.string().default("HOME"),
  flatHouse: z.string().min(1),
  areaStreet: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().length(6),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type CreateAddressResult =
  | { success: true; data: AddressData }
  | { success: false; message: string };

export async function createAddress(data: unknown): Promise<CreateAddressResult> {
  const validated = addressSchema.parse(data);

  try {
    if (validated.isDefault) {
      await prisma.address.updateMany({
        where: { userId: validated.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: validated,
    });

    return {
      success: true,
      data: {
        id: address.id,
        type: address.type,
        flatHouse: address.flatHouse,
        areaStreet: address.areaStreet,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: address.phone,
        isDefault: address.isDefault,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, message: "This address already exists" };
    }
    throw error;
  }
}

export async function getAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return {
    success: true,
    data: addresses.map((a) => ({
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
  };
}

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