"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const { register, error, loading, clearError } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    agreeToTerms: false,
    confirmInfo: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      // Handle nested objects (address)
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, string>),
          [child]: value,
        },
      })
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required"
        isValid = false
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
        isValid = false
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid 10-digit phone number"
        isValid = false
      }

      if (!formData.address.street.trim()) {
        newErrors["address.street"] = "Street address is required"
        isValid = false
      }

      if (!formData.address.city.trim()) {
        newErrors["address.city"] = "City is required"
        isValid = false
      }

      if (!formData.address.state.trim()) {
        newErrors["address.state"] = "State is required"
        isValid = false
      }

      if (!formData.address.zipCode.trim()) {
        newErrors["address.zipCode"] = "ZIP code is required"
        isValid = false
      }
    } else if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
        isValid = false
      }

      if (!formData.password) {
        newErrors.password = "Password is required"
        isValid = false
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long"
        isValid = false
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
        isValid = false
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy"
        isValid = false
      }
    } else if (step === 3) {
      if (!formData.confirmInfo) {
        newErrors.confirmInfo = "Please confirm that your information is accurate"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    clearError()

    // Format the data for the API
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zipCode: formData.address.zipCode,
      },
    }

    try {
      await register(userData)
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      })
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>

      <Link href="/" className="mb-4 flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">C1</span>
        </div>
        <span className="font-semibold text-xl">CitizenOne</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            {step === 1 && "Enter your personal information to get started"}
            {step === 2 && "Create your account credentials"}
            {step === 3 && "Review and confirm your information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.street">Street Address</Label>
                <Input
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  required
                />
                {errors["address.street"] && <p className="text-sm text-destructive">{errors["address.street"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.city">City</Label>
                <Input
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Metropolis"
                  required
                />
                {errors["address.city"] && <p className="text-sm text-destructive">{errors["address.city"]}</p>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="address.state">State</Label>
                  <Input
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                  {errors["address.state"] && <p className="text-sm text-destructive">{errors["address.state"]}</p>}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="address.zipCode">ZIP Code</Label>
                  <Input
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="12345"
                    required
                  />
                  {errors["address.zipCode"] && <p className="text-sm text-destructive">{errors["address.zipCode"]}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Next
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={nextStep} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.smith@example.com"
                  required
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and include a mix of letters, numbers, and special
                  characters.
                </p>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link href="#" className="text-primary underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Next
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                  <p className="font-medium">{formData.name}</p>
                  <p className="text-sm">{formData.phone}</p>
                  <p className="text-sm">{formData.address.street}</p>
                  <p className="text-sm">
                    {formData.address.city}, {formData.address.state} {formData.address.zipCode}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Information</h3>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirmInfo"
                  name="confirmInfo"
                  checked={formData.confirmInfo}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <Label htmlFor="confirmInfo" className="text-sm">
                  I confirm that all the information provided is accurate and complete
                </Label>
              </div>
              {errors.confirmInfo && <p className="text-sm text-destructive">{errors.confirmInfo}</p>}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

