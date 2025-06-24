import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Activity, BarChart3, Target, ArrowRight, CheckCircle, Leaf } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Set Goals",
    description:
      "Create your account and set personalized environmental goals based on your lifestyle and sustainability objectives.",
    details: ["Quick 2-minute registration", "Personalized goal recommendations", "Choose your focus areas"],
  },
  {
    icon: Activity,
    title: "Log Eco Activities",
    description:
      "Track your daily eco-friendly activities using our smart logging system with automatic carbon impact calculations.",
    details: ["Smart activity categorization", "Automatic carbon calculations", "Photo and note attachments"],
  },
  {
    icon: BarChart3,
    title: "Monitor Progress",
    description:
      "View detailed analytics and insights about your carbon footprint reduction and environmental impact over time.",
    details: ["Real-time progress tracking", "Detailed analytics dashboard", "Trend analysis and projections"],
  },
  {
    icon: Target,
    title: "Achieve & Share",
    description: "Reach your sustainability goals, earn achievements, and share your success with the community.",
    details: ["Achievement badges and rewards", "Community sharing features", "Impact certificates"],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How CarbonWise Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process makes it easy to start tracking and reducing your carbon footprint today.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-white text-green-600 border-2 border-green-600">
                      {index + 1}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <Card className="flex-1 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 text-lg mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-8">
                  <ArrowRight className="h-8 w-8 text-green-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Start your sustainability journey today and join our community of eco-conscious individuals.
          </p>
          <a
            href="/auth/signup"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Now
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
