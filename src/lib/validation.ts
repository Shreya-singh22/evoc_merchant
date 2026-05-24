import { z } from "zod";

export const phoneSchema = z.string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^[6789]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");

export const customerDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: phoneSchema,
});

export const addressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]),
  flatHouse: z.string().min(1, "House/Flat number is required").max(100),
  areaStreet: z.string().min(1, "Area/Street is required").max(200),
  city: z.string()
    .min(1, "City is required")
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, "City must contain only letters"),
  state: z.string()
    .min(1, "State is required")
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, "State must contain only letters"),
  pincode: z.string()
    .length(6, "PIN code must be 6 digits")
    .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  phone: z.string().optional(),
  isDefault: z.boolean(),
});

export const otpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numeric"),
  sessionId: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof customerDetailsSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type OtpData = z.infer<typeof otpSchema>;