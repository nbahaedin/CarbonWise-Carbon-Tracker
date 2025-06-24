"use client"

import { AuthForm } from "@/components/auth-form"
import { Navbar } from "@/components/navbar"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  )
}
