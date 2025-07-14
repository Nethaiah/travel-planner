"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Loader2, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Chrome, Plane, AlertCircle } from "lucide-react"
import Link from "next/link"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { register } from "@/app/server/userActions"
import { toast } from "sonner"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [password, setPassword] = useState("")
  const [formErrors, setFormErrors] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormErrors({})
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [formErrors])
  
  const { register: data, handleSubmit, setValue, getValues, reset } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: true,
    },
  })

  function handleAlert() {
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 3000)
  }

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }
  const passwordStrength = getPasswordStrength(password)

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    setShowAlert(false)
    setError(null)
    setFormErrors({})

    // Cast to RegisterFormData for validation (terms: true)
    const formData = { ...data, terms: acceptTerms } as unknown as RegisterFormData
    const result = registerSchema.safeParse(formData)
    setFormErrors(result.success ? {} : result.error.flatten().fieldErrors)
    if (!result.success) {
      setIsLoading(false)
      return
    }
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password })
      toast.success("Account created! Welcome 🎉", {
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

  // Google sign up placeholder
  const handleGoogleSignUp = () => {
    toast.error("Google sign-up is not implemented in this demo.", {
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
            <CardTitle className="text-2xl font-medium text-slate-900">Create account</CardTitle>
            <CardDescription className="text-slate-600">Start planning your perfect trips today</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent"
              onClick={handleGoogleSignUp}
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

            {/* Email Sign Up Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    {...data("name")}
                    type="text"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    autoComplete="name"
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    {...data("email")}
                    type="text"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                    className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    {...data("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    disabled={isLoading}
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setValue("password", e.target.value)
                    }}
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
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Password strength</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength >= 75 ? "text-emerald-600" :
                        passwordStrength >= 50 ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Good" : "Strong"}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className="h-1" />
                  </div>
                )}
                {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => {
                    setAcceptTerms(!!checked)
                    setValue("terms", !!checked)
                  }}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {formErrors.terms && <p className="text-sm text-red-600">{formErrors.terms}</p>}
              {showAlert && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 flex justify-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || !acceptTerms}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <Separator />

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}