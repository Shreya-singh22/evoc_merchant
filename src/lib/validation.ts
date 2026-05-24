import { z } from "zod";

export const customerDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
});

export const addressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]),
  flatHouse: z.string().min(1, "House/Flat number is required").max(100),
  areaStreet: z.string().min(1, "Area/Street is required").max(200),
  city: z.string().min(1, "City is required").max(50),
  state: z.string().min(1, "State is required").max(50),
  pincode: z.string().length(6, "PIN code must be 6 digits").regex(/^\d+$/, "PIN code must be numeric"),
  phone: z.string().optional(),
  isDefault: z.boolean(),
});

export const otpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(4, "OTP must be 4 digits").regex(/^\d+$/, "OTP must be numeric"),
  sessionId: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof customerDetailsSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type OtpData = z.infer<typeof otpSchema>;