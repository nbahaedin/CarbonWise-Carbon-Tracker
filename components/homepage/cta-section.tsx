"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Leaf, Sparkles, Users, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function CTASection() {
  const router = useRouter()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth?tab=signup")
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-green-600/20 to-emerald-800/40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Leaf className="h-8 w-8 text-green-200" />
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Make a Difference?</h2>

          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Join thousands of environmentally conscious individuals who are actively reducing their carbon footprint.
            Start your journey towards a more sustainable future today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {user ? "Go to Dashboard" : "Start Free Today"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2 text-green-100">
              <span className="text-sm">✓ Free forever</span>
              <span className="text-green-300">•</span>
              <span className="text-sm">✓ No credit card required</span>
              <span className="text-green-300">•</span>
              <span className="text-sm">✓ Setup in 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
              <p className="text-green-100 text-sm">
                Connect with 50,000+ users who are making a positive environmental impact every day.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-green-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Achieve Your Goals</h3>
              <p className="text-green-100 text-sm">
                Set personalized targets and get actionable insights to reduce your carbon footprint effectively.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Leaf className="h-12 w-12 text-green-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Make Real Impact</h3>
              <p className="text-green-100 text-sm">
                Track, reduce, and offset your emissions while contributing to global climate action.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold text-green-200">890K</div>
              <div className="text-sm text-green-100">Tons CO₂ Reduced</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-200">50K+</div>
              <div className="text-sm text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-200">127</div>
              <div className="text-sm text-green-100">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-200">4.9★</div>
              <div className="text-sm text-green-100">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
