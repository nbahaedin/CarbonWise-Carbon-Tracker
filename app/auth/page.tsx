"use client"

import { Suspense } from "react"
import { AuthForm } from "@/components/auth-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function AuthPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <AuthForm />
      </div>
      <Footer />
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
}
