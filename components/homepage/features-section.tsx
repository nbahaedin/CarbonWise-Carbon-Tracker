"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Target,
  Users,
  TrendingDown,
  Award,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Heart,
  TreePine,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Smart Tracking",
    description: "Automatically track your carbon footprint across transportation, energy, food, and shopping.",
    badge: "AI-Powered",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Target,
    title: "Personal Goals",
    description: "Set custom reduction targets and get personalized action plans to achieve them.",
    badge: "Personalized",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: TrendingDown,
    title: "Impact Visualization",
    description: "See your progress with beautiful charts and understand your environmental impact over time.",
    badge: "Visual",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Earn badges and rewards for reaching milestones and maintaining eco-friendly habits.",
    badge: "Gamified",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with like-minded individuals and compare your progress with friends and neighbors.",
    badge: "Social",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: TreePine,
    title: "Carbon Offsetting",
    description: "Offset your remaining emissions through verified projects like reforestation and clean energy.",
    badge: "Verified",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "Track",
    description: "Log your daily activities or connect your apps for automatic tracking.",
    icon: Smartphone,
  },
  {
    step: "02",
    title: "Analyze",
    description: "Get detailed insights into your carbon footprint and identify reduction opportunities.",
    icon: BarChart3,
  },
  {
    step: "03",
    title: "Reduce",
    description: "Follow personalized recommendations to lower your environmental impact.",
    icon: TrendingDown,
  },
  {
    step: "04",
    title: "Offset",
    description: "Compensate remaining emissions through certified environmental projects.",
    icon: Globe,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How CarbonWise Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process helps you understand, reduce, and offset your carbon footprint effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {howItWorks.map((step, index) => (
            <div key={step.step} className="text-center relative">
              {index < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-green-300 transform -translate-x-1/2"></div>
              )}
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <step.icon className="h-10 w-10 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to take control of your environmental impact and make a real difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">Trusted by Environmental Leaders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="font-semibold">Verified Data</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Real-time Sync</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="font-semibold">Privacy First</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Globe className="h-6 w-6 text-purple-600" />
              <span className="font-semibold">Global Impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
