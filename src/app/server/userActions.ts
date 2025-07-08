"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
// Import manual validation function and types
import { validateRegisterForm, validateLoginForm } from "@/lib/validations"
import type { RegisterFormData, LoginFormData } from "@/type/types"

// AUTH FUNCTIONS

// Register function
export const register = async ({ name, email, password }: { name: string, email: string, password: string }) => {
    // Build data object for validation (terms assumed true on server)
    const data: RegisterFormData = { name, email, password, terms: true }

    // Validate data using manual function
    const errors = validateRegisterForm(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (existingUser) {
        // Throw error if user already exists
        throw new Error("User already exists")
    }

    if (Object.keys(errors).length > 0) {
        // Throw error if validation fails
        throw new Error(Object.values(errors).join("; "))
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name: data.name,
                email: data.email,
                password: data.password,
            }
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}

// Login function
export const login = async ({ email, password }: { email: string, password: string }) => {
    // Build data object for validation
    const data: LoginFormData = { email, password }

    // Validate data using manual function
    const errors = validateLoginForm(data)

    if (Object.keys(errors).length > 0) {
        // Throw error if validation fails
        throw new Error(Object.values(errors).join("; "))
    }

    try {
        await auth.api.signInEmail({
            body: {
                email: data.email,
                password: data.password,
            }
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}


