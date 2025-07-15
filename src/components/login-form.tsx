"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, Chrome, Plane, AlertCircle} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { login } from "@/app/server/userActions"
import { zodResolver } from "@hookform/resolvers/zod"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const router = useRouter()

  // Auto-dismiss server error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function handleAlert() {
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 3000)
  }

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    setShowAlert(false)
    setError(null)
    try {
      await login({ email: data.email, password: data.password })
      toast.success("Login successful! Welcome back 👋", {
        duration: 3000,
        position: "bottom-right",
      })
      router.push("/dashboard")
    } catch (err) {
      handleAlert()
      setError(err instanceof Error ? err.message : "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  // Google sign-in placeholder
  const handleGoogleSignIn = () => {
    toast.error("Google sign-in is not implemented in this demo.", {
      duration: 3000,
      position: "bottom-right",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back to Home */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-medium text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-600">Sign in to continue planning your adventures</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-500">or</span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    {...register("email")}
                    type="text"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {/* Show email error if present */}
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"            
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {/* Show password error if present */}
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-end">
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              {showAlert && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 flex justify-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white  " disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Separator />

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}