import { z } from "zod";

// Zod schema for registration form data
export const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, { message: "You must accept the terms" }),
});

// Zod schema for login form data
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;