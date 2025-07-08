// Type for registration form data
export type RegisterFormData = {
  name: string; // User's full name
  email: string; // User's email address
  password: string; // User's password
  terms: boolean; // Whether user accepted terms
};

// Type for login form data
export type LoginFormData = {
  email: string; // User's email address
  password: string; // User's password
};
