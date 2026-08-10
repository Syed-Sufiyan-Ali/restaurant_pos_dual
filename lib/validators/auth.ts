// lib/validators/auth.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters").max(100),
  email:    z.string().email("Invalid email address"),
  phone:    z.string().regex(/^(\+92|0)[0-9]{10}$/, "Enter a valid Pakistani phone number").optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
             .regex(/[A-Z]/, "Must contain at least one uppercase letter")
             .regex(/[0-9]/, "Must contain at least one number"),
});

export const LoginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  token:    z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
             .regex(/[A-Z]/, "Must contain at least one uppercase letter")
             .regex(/[0-9]/, "Must contain at least one number"),
});

export const UpdateProfileSchema = z.object({
  name:  z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^(\+92|0)[0-9]{10}$/).optional(),
});

export type RegisterInput       = z.infer<typeof RegisterSchema>;
export type LoginInput           = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput  = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput   = z.infer<typeof ResetPasswordSchema>;
export type UpdateProfileInput   = z.infer<typeof UpdateProfileSchema>;
