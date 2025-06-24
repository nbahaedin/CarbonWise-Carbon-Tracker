"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Mail, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Suspense } from "react"

function OTPReceivedContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const message = searchParams.get("message") || ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Password Reset Code</h1>
            <p className="text-gray-600 mt-2">Your verification code has been sent</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <CardTitle>Email Sent</CardTitle>
              </div>
              <CardDescription>Check your email for the verification code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Email Content:</h3>
                <div className="text-blue-800 text-sm whitespace-pre-line font-mono bg-white p-3 rounded border">
                  {message || "Your OTP for changing your password has been sent to your email."}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Email sent to:</strong> {email}
                </p>
                <p>
                  <strong>Next steps:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Copy the 6-digit code from the email above</li>
                  <li>Return to the password reset page</li>
                  <li>Enter the verification code</li>
                  <li>Create your new password</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Link href="/auth/forgot-password" className="block">
                  <Button className="w-full h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Password Reset
                  </Button>
                </Link>

                <Link href="/auth/signin" className="block">
                  <Button variant="outline" className="w-full h-11">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OTPReceivedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPReceivedContent />
    </Suspense>
  )
}
