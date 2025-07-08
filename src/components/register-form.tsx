"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Check, Chrome } from "lucide-react"
import Link from "next/link"
import { validateRegisterForm } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { register } from "@/app/server/userActions"
import type { RegisterFormData } from "@/type/types"
// Import toast from sonner
import { toast } from "sonner"

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [password, setPassword] = useState("")
  const [formErrors, setFormErrors] = useState<any>({}) // errors not typed
  const router = useRouter()

  // Auto-dismiss field errors after 3 seconds
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormErrors({})
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [formErrors])

  // useForm for input state management
  const { register: data, handleSubmit, setValue, getValues, reset } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  })

  // Password strength calculation (unchanged)
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const getStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-red-400"
    if (strength < 50) return "bg-orange-400"
    if (strength < 75) return "bg-yellow-400"
    return "bg-emerald-400"
  }

  const getStrengthText = (strength: number) => {
    if (strength < 25) return "Weak"
    if (strength < 50) return "Fair"
    if (strength < 75) return "Good"
    return "Strong"
  }

  // Handle form submission with manual validation
  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    setError(null)
    setFormErrors({})
    // Use acceptTerms state for terms
    const formData = { ...data, terms: acceptTerms }
    const errors = validateRegisterForm(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      setIsLoading(false)
      return
    }
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password })
      // Show success toast
      toast.success("Account created! Welcome 🎉", {
        duration: 3000,
        position: "top-center",
      })
      router.push("/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password", {
        duration: 3000,
        position: "top-center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
              Create your account
            </CardTitle>
            <CardDescription className="text-slate-600 text-base leading-relaxed">
              Join thousands of travelers and start planning your dream trips
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium h-12 text-sm transition-all duration-200 hover:border-slate-300"
              disabled={isLoading}
            >
              <Chrome className="mr-3 h-4 w-4 text-blue-500" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
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
                    className="pl-10 h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-1 transition-all duration-200"
                  />
                </div>
                {/* Show name error if present */}
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    {...data("email")}
                    type="text"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="pl-10 h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-1 transition-all duration-200"
                  />
                </div>
                {/* Show email error if present */}
                {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
              </div>

              {/* Password */}
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
                    placeholder="Create a strong password"
                    disabled={isLoading}
                    minLength={8}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setValue("password", e.target.value)
                    }}
                    className="pl-10 pr-10 h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500 focus:ring-1 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {/* Password Strength */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Password strength</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength >= 75 ? "text-emerald-600" : 
                        passwordStrength >= 50 ? "text-yellow-600" : 
                        "text-red-600"
                      }`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Use 8+ characters with uppercase, lowercase, numbers, and symbols
                </p>
                {/* Show password error if present */}
                {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => {
                    setAcceptTerms(!!checked)
                    setValue("terms", !!checked)
                  }}
                  className="mt-0.5 border-slate-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <button type="button" className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2">
                    Privacy Policy
                  </button>
                </Label>
              </div>
              {/* Show terms error if present */}
              {formErrors.terms && <p className="text-sm text-red-600">{formErrors.terms}</p>}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-slate-600 text-sm">
                Already have an account?{" "}
                <button type="button" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                  <Link href="/login" className="ml-1">
                    Sign in here
                  </Link>
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-slate-900 text-center mb-4 text-sm">
            What you'll get:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-700">Unlimited trip planning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-700">Collaborative sharing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-700">Smart expense tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-700">24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}