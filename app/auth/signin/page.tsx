"use client"

import { AuthForm } from "@/components/auth-form"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <AuthForm mode="signin" />
          <div className="mt-6 text-center">
            <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
