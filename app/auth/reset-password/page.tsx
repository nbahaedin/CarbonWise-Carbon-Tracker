"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Leaf, AlertCircle, Lock, Eye, EyeOff, Check, Copy, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { verifyOTP, resetPasswordWithToken } from "@/app/actions/auth-actions"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"otp" | "password" | "success">("otp")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [email, setEmail] = useState("")
  const [otpFromUrl, setOtpFromUrl] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Get OTP and email from URL parameters
    const urlOtp = searchParams.get("otp")
    const urlEmail = searchParams.get("email")

    if (urlOtp && urlEmail) {
      setOtpFromUrl(urlOtp)
      setEmail(decodeURIComponent(urlEmail))
      setOtp(urlOtp)
    }
  }, [searchParams])

  const copyOTP = async () => {
    if (otpFromUrl) {
      try {
        await navigator.clipboard.writeText(otpFromUrl)
        toast({
          title: "OTP Copied",
          description: "The verification code has been copied to your clipboard.",
        })
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = otpFromUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        toast({
          title: "OTP Copied",
          description: "The verification code has been copied to your clipboard.",
        })
      }
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!otp.trim()) {
      setError("Please enter the verification code")
      return
    }

    if (otp.length !== 6) {
      setError("Verification code must be 6 digits")
      return
    }

    if (!email) {
      setError("Email information is missing. Please start the password reset process again.")
      return
    }

    setLoading(true)

    try {
      const result = await verifyOTP(email, otp)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.resetToken) {
        setResetToken(result.resetToken)
        setStep("password")
        toast({
          title: "Code Verified",
          description: "Please create your new password below.",
        })
      }
    } catch (error: any) {
      setError("Failed to verify code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newPassword) {
      setError("New password is required")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const result = await resetPasswordWithToken(email, resetToken, newPassword)

      if (result.error) {
        setError(result.error)
        return
      }

      setStep("success")
      toast({
        title: "Password Reset Complete",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case "otp":
        return (
          <div className="space-y-4">
            {otpFromUrl && (
              <Alert className="bg-green-50 border-green-200">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Your verification code:</strong>
                      <div className="font-mono text-lg font-bold mt-1">{otpFromUrl}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyOTP}
                      className="ml-2 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-lg tracking-widest h-11 font-mono"
                  required
                />
                <div className="text-sm text-gray-600">
                  {email && (
                    <p>
                      Verification code for <strong>{email}</strong>
                    </p>
                  )}
                  <p className="text-xs text-amber-600">Code expires in 5 minutes</p>
                </div>
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Verify Code & Continue"}
              </Button>
            </form>
          </div>
        )

      case "password":
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="text-xs space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Use a combination of letters and numbers</li>
                <li>• Avoid using personal information</li>
              </ul>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              <Lock className="h-4 w-4 mr-2" />
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        )

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Password Reset Complete!</h3>
              <p className="text-gray-600">
                Your password has been successfully updated. You can now sign in to your CarbonWise account with your
                new password.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => router.push("/auth/signin")} className="w-full h-11">
                Sign In with New Password
              </Button>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full h-11">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepInfo = () => {
    switch (step) {
      case "otp":
        return {
          title: "Verify Your Code",
          description: "Enter the 6-digit verification code",
        }
      case "password":
        return {
          title: "Create New Password",
          description: "Choose a strong password for your account",
        }
      case "success":
        return {
          title: "All Done!",
          description: "Your password has been reset successfully",
        }
      default:
        return {
          title: "Reset Password",
          description: "",
        }
    }
  }

  const stepInfo = getStepInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{stepInfo.title}</h1>
            <p className="text-gray-600 mt-2">{stepInfo.description}</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span>Password Reset</span>
              </CardTitle>
              <CardDescription>{stepInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderStep()}
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/auth/signin" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
