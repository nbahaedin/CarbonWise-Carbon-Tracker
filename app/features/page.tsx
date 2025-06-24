import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Target, Users, Award, Smartphone, Shield, Zap, TrendingUp, Globe, Leaf } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get detailed insights into your carbon footprint with comprehensive charts and trends analysis.",
    badge: "Popular",
  },
  {
    icon: Target,
    title: "Goal Setting & Tracking",
    description: "Set personalized environmental goals and track your progress with smart milestones.",
    badge: "New",
  },
  {
    icon: Smartphone,
    title: "Smart Activity Logging",
    description: "Easily log eco-friendly activities with our intelligent categorization system.",
    badge: null,
  },
  {
    icon: Users,
    title: "Community Challenges",
    description: "Join community challenges and compete with friends to maximize your environmental impact.",
    badge: "Community",
  },
  {
    icon: Award,
    title: "Achievement System",
    description: "Earn badges and rewards for reaching sustainability milestones and maintaining streaks.",
    badge: null,
  },
  {
    icon: TrendingUp,
    title: "Impact Projections",
    description: "See your projected annual carbon reduction and understand your long-term environmental impact.",
    badge: null,
  },
  {
    icon: Globe,
    title: "Carbon Offset Marketplace",
    description: "Purchase verified carbon offsets to neutralize your remaining footprint.",
    badge: "Premium",
  },
  {
    icon: Shield,
    title: "Data Privacy & Security",
    description: "Your environmental data is protected with enterprise-grade security and privacy controls.",
    badge: null,
  },
  {
    icon: Zap,
    title: "Real-time Notifications",
    description: "Get timely reminders and insights to help you stay on track with your sustainability goals.",
    badge: null,
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Sustainable Living</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the tools and features that make CarbonWise the most comprehensive platform for tracking and
            reducing your environmental impact.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              {feature.badge && (
                <Badge
                  className="absolute -top-2 -right-2 z-10"
                  variant={feature.badge === "New" ? "default" : "secondary"}
                >
                  {feature.badge}
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Sustainability Journey?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who are already making a positive impact on the environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
