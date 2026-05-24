"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SESSION_COOKIE_NAME = "checkout_session_id";
const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutes

export async function createCheckoutSession(phone: string, deviceId: string): Promise<{
  success: boolean;
  expiresAt?: Date;
  message?: string;
}> {
  try {
    // Delete any existing sessions for this phone+deviceId
    await prisma.checkoutSession.deleteMany({
      where: { phone, deviceId },
    });

    // Create new session with 60 min expiry
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const session = await prisma.checkoutSession.create({
      data: {
        phone,
        deviceId,
        expiresAt,
      },
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return { success: true, expiresAt };
  } catch (error) {
    console.error("Create checkout session error:", error);
    return { success: false, message: "Failed to create session" };
  }
}

export async function validateCheckoutSession(): Promise<{
  valid: boolean;
  phone?: string;
  expiresAt?: Date;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { valid: false };
    }

    // Check if session exists and is not expired
    const session = await prisma.checkoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session cookie
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { valid: false };
    }

    return {
      valid: true,
      phone: session.phone,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error("Validate checkout session error:", error);
    return { valid: false };
  }
}

export async function deleteCheckoutSession(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // Delete from database if exists
    if (sessionId) {
      await prisma.checkoutSession.deleteMany({
        where: { id: sessionId },
      });
    }

    // Clear cookie
    cookieStore.delete(SESSION_COOKIE_NAME);

    // Revalidate checkout page to reflect logged-out state
    revalidatePath("/checkout");

    return { success: true };
  } catch (error) {
    console.error("Delete checkout session error:", error);
    return { success: false };
  }
}