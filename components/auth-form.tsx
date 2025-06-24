"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Leaf, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn, signUp, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
    setError("")
  }

  const validateForm = (isSignUp = false) => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }

    if (!password) {
      setError("Password is required")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (isSignUp && !fullName.trim()) {
      setError("Full name is required")
      return false
    }

    return true
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm(true)) return

    setLoading(true)
    try {
      const result = await signUp(email, password, fullName)

      if (result.error) {
        setError(result.error)
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please sign in with your new account.",
        })
        resetForm()
        router.push("/auth/signin")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-4">
          <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {mode === "signin" ? "Welcome Back" : "Join CarbonWise"}
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {mode === "signin"
            ? "Sign in to your account to continue tracking your carbon footprint"
            : "Create your account and start making a positive environmental impact"}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">{mode === "signin" ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription className="text-sm">
            {mode === "signin"
              ? "Enter your credentials to access your dashboard"
              : "Join thousands of users making a positive impact on the environment"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Sign up here
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-fullname" className="text-sm">
                  Full Name
                </Label>
                <Input
                  id="signup-fullname"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in here
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-xs sm:text-sm text-gray-600">
        <p>By {mode === "signin" ? "signing in" : "signing up"}, you agree to help reduce your carbon footprint! 🌱</p>
      </div>
    </div>
  )
}
