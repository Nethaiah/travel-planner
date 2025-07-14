"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
// Import manual validation function and types
import { registerSchema, loginSchema } from "@/lib/validations"
import type { RegisterFormData, LoginFormData } from "@/lib/validations"
import { headers } from "next/headers"

// AUTH FUNCTIONS

// Register function
export const register = async ({ name, email, password }: { name: string, email: string, password: string }) => {
    // Build data object for validation (terms assumed true on server)
    const data: RegisterFormData = { name, email, password, terms: true }

    // Validate data using Zod schema
    const result = registerSchema.safeParse(data)
    if (!result.success) {
        throw new Error(Object.values(result.error.flatten().fieldErrors).flat().join("; "))
    }

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

    // Validate data using Zod schema
    const result = loginSchema.safeParse(data)
    if (!result.success) {
        throw new Error(Object.values(result.error.flatten().fieldErrors).flat().join("; "))
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

// Logout function
export const logout = async () => {
    try {
        await auth.api.signOut({
            headers: await headers()
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}

// Get session function
export const getSession = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        return session
    } catch (err) {
        console.error(err)
        throw err
    }
}




