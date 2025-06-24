"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, ArrowRight, Calculator, TrendingDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()
  const [calculatorData, setCalculatorData] = useState({
    transport: "",
    energy: "",
    diet: "",
  })
  const [estimatedFootprint, setEstimatedFootprint] = useState<number | null>(null)

  const calculateFootprint = () => {
    // Simple calculation based on user inputs
    const transport = Number(calculatorData.transport) || 0
    const energy = Number(calculatorData.energy) || 0
    const dietMultiplier = calculatorData.diet === "meat" ? 2.5 : calculatorData.diet === "vegetarian" ? 1.5 : 1.0

    const monthlyFootprint = transport * 0.21 * 30 + energy * 0.5 + dietMultiplier * 30
    setEstimatedFootprint(monthlyFootprint)
  }

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth?tab=signup")
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Carbon Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Track Your Carbon.{" "}
              <span className="text-green-600 relative">
                Change the World.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-green-200"
                  viewBox="0 0 200 12"
                  fill="currentColor"
                >
                  <path d="M0,8 Q50,0 100,4 T200,6 L200,12 L0,12 Z" />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Take control of your environmental impact with our intelligent carbon footprint tracker. Monitor, reduce,
              and offset your emissions while joining a community committed to fighting climate change.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
                {user ? "Go to Dashboard" : "Start Tracking Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Calculator className="mr-2 h-5 w-5" />
                Quick Calculator
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">2.3M</div>
                <div className="text-sm text-gray-600">Tons CO₂ Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">890K</div>
                <div className="text-sm text-gray-600">Tons Reduced</div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Calculator */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Calculator className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold">Quick Carbon Calculator</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transport">Daily commute (km)</Label>
                    <Input
                      id="transport"
                      type="number"
                      placeholder="e.g., 20"
                      value={calculatorData.transport}
                      onChange={(e) => setCalculatorData({ ...calculatorData, transport: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="energy">Monthly electricity (kWh)</Label>
                    <Input
                      id="energy"
                      type="number"
                      placeholder="e.g., 300"
                      value={calculatorData.energy}
                      onChange={(e) => setCalculatorData({ ...calculatorData, energy: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="diet">Diet type</Label>
                    <Select
                      value={calculatorData.diet}
                      onValueChange={(value) => setCalculatorData({ ...calculatorData, diet: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your diet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="meat">Meat-eater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={calculateFootprint} className="w-full">
                    Calculate My Footprint
                  </Button>

                  {estimatedFootprint && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Your Estimated Monthly Footprint</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{estimatedFootprint.toFixed(1)} kg CO₂</div>
                      <p className="text-sm text-green-700 mt-2">
                        Start tracking to get precise measurements and personalized reduction tips!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
