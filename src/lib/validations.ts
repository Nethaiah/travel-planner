import { z } from "zod";

// Zod schema for registration form data
export const registerSchema = z.object({ // this is the schema / validationfor the form data
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
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
    { message: "Start date must be in the future" }
  ),
  budget: z.number().min(0, "Budget must be 0 or greater").optional(),
  coverImage: z.url("Cover image must be a valid URL"),
  images: z.array(z.url("Each image must be a valid URL")).min(1, "At least one image is required"),
  lat: z.number().refine((v) => v !== undefined && v !== null, { message: "Latitude is required" }),
  lon: z.number().refine((v) => v !== undefined && v !== null, { message: "Longitude is required" }),
  // --- LocationIQ fields ---
  placeId: z.string().optional(),
  osmId: z.string().optional(),
  osmType: z.string().optional(),
  class: z.string().optional(),
  type: z.string().optional(),
  importance: z.number().optional(),
  icon: z.string().optional(),
  displayName: z.string().optional(),
  addressJson: z.any().optional(),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"], // This will show the error on the endDate field
  }
);
export type TripFormData = z.infer<typeof tripSchema>;

// Zod schema for activity creation form data
export const activitySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().max(500).optional(),
  location: z.string().max(255).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  cost: z.number().min(0, "Cost must be 0 or greater").optional(),
  category: z.enum(["activity", "accommodation", "food", "transport", "other"]),
});
export type ActivityFormData = z.infer<typeof activitySchema>;