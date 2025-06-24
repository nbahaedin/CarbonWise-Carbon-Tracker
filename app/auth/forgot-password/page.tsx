"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Leaf, AlertCircle, Mail, ArrowLeft, Check, Shield, Lock, Eye, EyeOff, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { sendOTPEmail, verifyOTP, resetPasswordWithToken } from "@/app/actions/auth-actions"
import React from "react"

type Step = "email" | "otp" | "password" | "success"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const { toast } = useToast()

  // Cooldown timer for resend button
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email address is required")
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const result = await sendOTPEmail(email.trim())

      if (result.error) {
        setError(result.error)
        return
      }

      setStep("otp")
      setResendCooldown(60) // 60 seconds cooldown

      toast({
        title: "Verification Code Sent",
        description: `A 6-digit verification code has been sent to ${email}. Please check your email.`,
      })
    } catch (error: any) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
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

    setLoading(true)

    try {
      const result = await verifyOTP(email.trim(), otp)

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
      const result = await resetPasswordWithToken(email.trim(), resetToken, newPassword)

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

  const handleResendOTP = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before requesting a new code`)
      return
    }

    setError("")
    setOtp("")
    setLoading(true)

    try {
      const result = await sendOTPEmail(email.trim())

      if (result.error) {
        setError(result.error)
        return
      }

      setResendCooldown(60) // 60 seconds cooldown

      toast({
        title: "New Code Sent",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error: any) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="h-11"
              />
              <p className="text-sm text-gray-600">Enter the email address associated with your CarbonWise account.</p>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              <Mail className="h-4 w-4 mr-2" />
              {loading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>
        )

      case "otp":
        return (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Check your email!</strong> We've sent a message to <strong>{email}</strong> with your 6-digit
                verification code. The email will contain the text:
                <div className="mt-2 p-2 bg-white rounded border text-sm font-mono">
                  "Your OTP for changing your password is: XXXXXX"
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code from email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-lg tracking-widest h-11 font-mono"
                  required
                />
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Copy the 6-digit code from the email sent to your inbox</p>
                  <div className="flex items-center space-x-1 text-xs text-amber-600">
                    <Clock className="h-3 w-3" />
                    <span>Code expires in 5 minutes</span>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading || otp.length !== 6}>
                <Shield className="h-4 w-4 mr-2" />
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || resendCooldown > 0}
                  className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't receive the email? Resend"}
                </button>
              </div>
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
      case "email":
        return {
          title: "Reset Your Password",
          description: "Enter your email to receive a verification code",
          icon: <Mail className="h-5 w-5 text-blue-600" />,
          stepNumber: 1,
        }
      case "otp":
        return {
          title: "Enter Verification Code",
          description: "Check your email for the 6-digit code",
          icon: <Shield className="h-5 w-5 text-orange-600" />,
          stepNumber: 2,
        }
      case "password":
        return {
          title: "Create New Password",
          description: "Choose a strong password for your account",
          icon: <Lock className="h-5 w-5 text-green-600" />,
          stepNumber: 3,
        }
      case "success":
        return {
          title: "All Done!",
          description: "Your password has been reset successfully",
          icon: <Check className="h-5 w-5 text-green-600" />,
          stepNumber: 4,
        }
      default:
        return {
          title: "Reset Password",
          description: "",
          icon: <Mail className="h-5 w-5" />,
          stepNumber: 1,
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {stepInfo.icon}
                  <CardTitle>Step {stepInfo.stepNumber} of 4</CardTitle>
                </div>
                {step !== "email" && step !== "success" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (step === "otp") setStep("email")
                      if (step === "password") setStep("otp")
                      setError("")
                    }}
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
              </div>
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
              Remember your password? Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
