"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
});

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY;
const BASE_URL = "https://2factor.in/API/V1";

interface TwoFactorResponse {
  Status: "Success" | "Error";
  Details: string;
}

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

  if (!TWO_FACTOR_API_KEY) {
    console.error("[2FACTOR] API key not configured");
    return { success: false, message: "OTP service not configured" };
  }

  // Delete existing unverified OTPs
  await prisma.otpVerification.deleteMany({
    where: { phone: cleanPhone, verified: false },
  });

  try {
    // 2Factor API format: /SMS/+919999999999/AUTOGEN3/OTP1
    const url = `${BASE_URL}/${TWO_FACTOR_API_KEY}/SMS/${encodeURIComponent(formattedPhone)}/AUTOGEN3/OTP1`;

    console.log("[2FACTOR] Sending OTP...");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result: TwoFactorResponse = await response.json();
    console.log("[2FACTOR] Response:", result);

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
    };
  } catch (error: any) {
    console.error("[2FACTOR] Error:", error);
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
}

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(4),
});

export async function verifyOtp(data: unknown) {
  const { phone, code } = verifyOtpSchema.parse(data);
  const cleanPhone = phone.replace(/\D/g, "");

  if (!TWO_FACTOR_API_KEY) {
    console.error("[2FACTOR] API key not configured");
    return { success: false, message: "OTP service not configured" };
  }

  // Find the latest unverified OTP
  const otp = await prisma.otpVerification.findFirst({
    where: { phone: cleanPhone, verified: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return { success: false, message: "No OTP found. Please request a new one." };
  }

  if (new Date() > otp.expiresAt) {
    return { success: false, message: "OTP has expired. Please request a new one." };
  }

  try {
    // 2Factor API format for verify: /SMS/VERIFY3/919999999999/1234
    // Phone should be 91XXXXXXXXXX (12 digits, no +)
    const phoneForVerify = cleanPhone.length === 12 ? cleanPhone : `91${cleanPhone}`;
    const url = `${BASE_URL}/${TWO_FACTOR_API_KEY}/SMS/VERIFY3/${phoneForVerify}/${code}`;

    console.log("[2FACTOR] Verifying OTP...");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result: TwoFactorResponse = await response.json();
    console.log("[2FACTOR] Verify Response:", result);

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
    console.error("[2FACTOR] Verify Error:", error);
    return { success: false, message: error.message || "Failed to verify OTP" };
  }
}