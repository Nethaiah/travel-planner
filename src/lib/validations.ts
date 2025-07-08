import { RegisterFormData, LoginFormData } from "@/type/types";

// Manual validation function for registration form data
export function validateRegisterForm(data: RegisterFormData): any {
  const errors: any = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Full name is required";
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    errors.email = "Invalid email address";
  }

  // Validate password
  if (!data.password || data.password.length === 0) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Validate terms acceptance
  if (!data.terms) {
    errors.terms = "You must accept the terms";
  }

  return errors;
} 

// Manual validation function for login form data
export function validateLoginForm(data: LoginFormData): any {
  const errors: any = {};

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    errors.email = "Invalid email address";
  }

  // Validate password
  if (!data.password || data.password.length === 0) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}