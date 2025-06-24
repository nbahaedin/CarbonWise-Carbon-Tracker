"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Leaf, Globe, Award, Target } from "lucide-react"
import { useEffect, useState } from "react"

const stats = [
  {
    icon: Users,
    label: "Active Users",
    value: 52847,
    suffix: "+",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "People tracking their carbon footprint",
  },
  {
    icon: Leaf,
    label: "CO₂ Reduced",
    value: 890.5,
    suffix: "K tons",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Total emissions reduced by our community",
  },
  {
    icon: Globe,
    label: "Countries",
    value: 127,
    suffix: "",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Countries using CarbonWise",
  },
  {
    icon: Award,
    label: "Achievements",
    value: 1.2,
    suffix: "M",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Eco-friendly milestones reached",
  },
  {
    icon: Target,
    label: "Goals Met",
    value: 78,
    suffix: "%",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    description: "Users achieving their reduction targets",
  },
  {
    icon: TrendingUp,
    label: "Avg. Reduction",
    value: 23,
    suffix: "%",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Average carbon footprint reduction",
  },
]

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return <span>{count}</span>
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Making a Global Impact</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of environmentally conscious individuals who are actively reducing their carbon footprint and
            creating positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-3xl font-bold ${stat.color}`}>
                        <AnimatedCounter value={stat.value} />
                      </span>
                      <span className={`text-lg font-semibold ${stat.color}`}>{stat.suffix}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Updates Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live updates • Last updated 2 minutes ago</span>
          </div>
        </div>
      </div>
    </section>
  )
}
