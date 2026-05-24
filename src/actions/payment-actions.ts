"use server";

import { generatePayUHash, PayUHashData, PAYU_KEY } from "@/lib/payu";

export async function getPayUHash(data: PayUHashData): Promise<{ hash: string; key: string }> {
  const hash = await generatePayUHash(data);
  return {
    hash,
    key: data.key,
  };
}

export async function getPayUKey(): Promise<{ key: string }> {
  return { key: PAYU_KEY };
}