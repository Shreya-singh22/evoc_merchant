"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

const MAX_OTP_PER_HOUR = 5;
const RESEND_TIMER_SECONDS = 120; // 2 minutes

const sendOtpSchema = z.object({
  phone: z.string().regex(/^[6789]\d{9}$/, "Invalid Indian phone number"),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6789]\d{9}$/, "Invalid Indian phone number"),
  code: z.string().length(4),
  sessionId: z.string().optional(),
});

function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export async function sendOtp(data: unknown) {
  const { phone } = sendOtpSchema.parse(data);
  const formattedPhone = sanitizePhone(phone);
  const cleanPhone = phone.replace(/\D/g, "");

  if (!process.env.TWO_FACTOR_API_KEY) {
    return { success: false, message: "OTP service not configured" };
  }

  // Check rate limit: max 5 OTPs per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentOtps = await prisma.otpVerification.count({
    where: {
      phone: cleanPhone,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentOtps >= MAX_OTP_PER_HOUR) {
    return {
      success: false,
      message: "Too many OTP requests. Please try again after an hour.",
    };
  }

  // Delete existing unverified OTPs for this phone
  await prisma.otpVerification.deleteMany({
    where: { phone: cleanPhone, verified: false },
  });

  try {
    // 2Factor API format: /SMS/+919999999999/AUTOGEN3/OTP1
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${encodeURIComponent(formattedPhone)}/AUTOGEN3/OTP1`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const result = await response.json();

    if (result.Status !== "Success") {
      return {
        success: false,
        message: result.Details || "Failed to send OTP",
      };
    }

    const sessionId = result.Details;

    await prisma.otpVerification.create({
      data: {
        phone: cleanPhone,
        code: sessionId,
        sessionId: sessionId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return {
      success: true,
      message: "OTP sent successfully",
      sessionId,
      resendTimer: RESEND_TIMER_SECONDS,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
}

export async function verifyOtp(data: unknown) {
  const { phone, code, sessionId } = verifyOtpSchema.parse(data);
  const cleanPhone = phone.replace(/\D/g, "");

  if (!process.env.TWO_FACTOR_API_KEY) {
    return { success: false, message: "OTP service not configured" };
  }

  // Find the latest unverified OTP
  const otp = await prisma.otpVerification.findFirst({
    where: {
      phone: cleanPhone,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return { success: false, message: "No OTP found. Please request a new one." };
  }

  if (new Date() > otp.expiresAt) {
    return { success: false, message: "OTP has expired. Please request a new one." };
  }

  try {
    // 2Factor API format for verify: /SMS/VERIFY3/{phone}/{otp_code}
    const phoneForVerify = `91${cleanPhone}`;
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY3/${phoneForVerify}/${code}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const result = await response.json();

    if (result.Status !== "Success") {
      return { success: false, message: result.Details || "Invalid OTP" };
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone: cleanPhone, isVerified: true },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    return {
      success: true,
      message: "OTP verified successfully",
      data: { userId: user.id, phone: user.phone },
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to verify OTP" };
  }
}