"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Copy, Check, Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function OTPInfoPage() {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const otp = searchParams.get("otp")
  const email = searchParams.get("email")

  const copyOTP = async () => {
    if (otp) {
      try {
        await navigator.clipboard.writeText(otp)
        setCopied(true)
        toast({
          title: "Copied!",
          description: "OTP code copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Please manually copy the code",
          variant: "destructive",
        })
      }
    }
  }

  if (!otp || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Invalid or expired link. Please request a new verification code.</p>
              <Link href="/auth/forgot-password" className="mt-4 inline-block">
                <Button>Request New Code</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your Verification Code</h1>
            <p className="text-gray-600 mt-2">Use this code to reset your password</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Password Reset Code</span>
              </CardTitle>
              <CardDescription>Copy this code and paste it in the password reset form</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Code for: {decodeURIComponent(email)}</p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-4xl font-mono font-bold text-green-600 tracking-widest mb-4">{otp}</div>
                  <Button onClick={copyOTP} variant="outline" className="w-full">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Copy the 6-digit code above</li>
                  <li>2. Return to the password reset form</li>
                  <li>3. Paste the code and create your new password</li>
                </ol>
              </div>

              <div className="text-center space-y-3">
                <Link href="/auth/forgot-password">
                  <Button className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Password Reset
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">This code expires in 5 minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
