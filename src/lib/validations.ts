import { z } from "zod";

// Zod schema for registration form data
export const registerSchema = z.object({ // this is the schema / validationfor the form data
  name: z.string()
    .refine(
      (val) => {
        // At least two words, each at least 2 characters, only letters, spaces, hyphens, apostrophes
        const words = val.trim().split(/\s+/)
        if (words.length < 2) return false
        if (!words.every(w => w.length >= 2)) return false
        // Allow letters, spaces, hyphens, apostrophes
        return /^[A-Za-z\s\-']+$/.test(val)
      },
      {
        message: "Full name is required"
      }
    ),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
});
export type RegisterFormData = z.infer<typeof registerSchema>; // this is for the types of the form data

// Zod schema for login form data
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// Zod schema for trip creation form data
export const tripSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().max(1000, "Description is required").optional(),
  destination: z.string().min(2, "Destination is required"),
  startDate: z.date().refine(
    (d) => d > new Date(),
    { message: "Start date must be in the future" }
  ),
  endDate: z.date().refine(
    (d) => d > new Date(),
    { message: "End date must be after start date" }
  ),
  budget: z.number().min(0, "Budget must be 0 or greater").optional(),
  coverImage: z.url("Cover image must be a valid URL").optional(),
  images: z.array(z.url("Each image must be a valid URL")).min(1, "At least one image is required"),
  lat: z.number().refine((v) => v !== undefined && v !== null, { message: "Latitude is required" }),
  lon: z.number().refine((v) => v !== undefined && v !== null, { message: "Longitude is required" }),
});
export type TripFormData = z.infer<typeof tripSchema>;