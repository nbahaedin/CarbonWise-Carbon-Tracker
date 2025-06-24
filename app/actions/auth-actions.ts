"use server"

import { createClient } from "@supabase/supabase-js"

// Create a service role client for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// In-memory storage for demo (use database in production)
const otpStore = new Map<
  string,
  {
    email: string
    otp: string
    expiresAt: Date
  }
>()

const resetTokenStore = new Map<
  string,
  {
    email: string
    token: string
    expiresAt: Date
  }
>()

export async function sendOTPEmail(email: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists in Supabase Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error("Auth error:", authError)
      return { error: "Failed to verify user. Please try again." }
    }

    // Find user by email
    const userExists = authUsers.users.find((user) => user.email?.toLowerCase() === normalizedEmail)

    if (!userExists) {
      return {
        error: "No account found with this email address. Please check your email or create a new account.",
      }
    }

    // Check if user's email is confirmed
    if (!userExists.email_confirmed_at) {
      return {
        error: "Please verify your email address first before resetting your password.",
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Store OTP
    otpStore.set(normalizedEmail, {
      email: normalizedEmail,
      otp,
      expiresAt,
    })

    // Get the current site URL
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    // Create a simple email message with OTP
    const emailMessage = `Your OTP for changing your password is: ${otp}

This code will expire in 5 minutes.

If you didn't request this password reset, please ignore this email.

- CarbonWise Team`

    // Use Supabase's password reset email but with custom redirect that includes the OTP message
    const customRedirectUrl = `${siteUrl}/auth/otp-received?email=${encodeURIComponent(normalizedEmail)}&message=${encodeURIComponent(emailMessage)}`

    const { error: emailError } = await supabaseAdmin.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: customRedirectUrl,
    })

    if (emailError) {
      console.error("Email sending error:", emailError)
      // Remove OTP if email failed to send
      otpStore.delete(normalizedEmail)
      return { error: "Failed to send verification code. Please try again." }
    }

    // Log the OTP for development (remove in production)
    console.log(`📧 OTP sent to ${normalizedEmail}: ${otp}`)

    return {
      success: true,
      message: "Verification code sent to your email address",
    }
  } catch (error: any) {
    console.error("Send OTP error:", error)
    return { error: "Failed to send verification code. Please try again." }
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const storedData = otpStore.get(normalizedEmail)

    if (!storedData) {
      return { error: "Verification code not found or expired. Please request a new one." }
    }

    if (new Date() > storedData.expiresAt) {
      otpStore.delete(normalizedEmail)
      return { error: "Verification code has expired. Please request a new one." }
    }

    if (storedData.otp !== otp.trim()) {
      return { error: "Invalid verification code. Please check and try again." }
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store reset token
    resetTokenStore.set(normalizedEmail, {
      email: normalizedEmail,
      token: resetToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    })

    // Remove used OTP
    otpStore.delete(normalizedEmail)

    return { success: true, resetToken }
  } catch (error: any) {
    console.error("Verify OTP error:", error)
    return { error: "Failed to verify code. Please try again." }
  }
}

export async function resetPasswordWithToken(email: string, resetToken: string, newPassword: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const storedData = resetTokenStore.get(normalizedEmail)

    if (!storedData || storedData.token !== resetToken) {
      return { error: "Invalid or expired reset session. Please start over." }
    }

    if (new Date() > storedData.expiresAt) {
      resetTokenStore.delete(normalizedEmail)
      return { error: "Reset session has expired. Please start over." }
    }

    // Get the user from Supabase Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      return { error: "Failed to find user. Please try again." }
    }

    const user = authUsers.users.find((u) => u.email?.toLowerCase() === normalizedEmail)

    if (!user) {
      return { error: "User not found. Please try again." }
    }

    // Update user password using Supabase Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })

    if (updateError) {
      console.error("Password update error:", updateError)
      return { error: "Failed to update password. Please try again." }
    }

    // Clean up reset token
    resetTokenStore.delete(normalizedEmail)

    return { success: true, message: "Password updated successfully" }
  } catch (error: any) {
    console.error("Reset password error:", error)
    return { error: "Failed to reset password. Please try again." }
  }
}
