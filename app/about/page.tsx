"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Target, Globe, Heart, Award } from "lucide-react"

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Environmental scientist with 10+ years in climate research. Former NASA researcher passionate about making sustainability accessible.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "CTO & Co-founder",
    bio: "Full-stack engineer with expertise in data analytics. Previously at Google, focused on building scalable environmental solutions.",
    avatar: "MJ",
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Product",
    bio: "Product designer with a focus on user experience. Believes in creating tools that make environmental action intuitive and engaging.",
    avatar: "ER",
  },
  {
    name: "David Kim",
    role: "Lead Data Scientist",
    bio: "PhD in Environmental Economics. Specializes in carbon accounting methodologies and impact measurement frameworks.",
    avatar: "DK",
  },
]

const values = [
  {
    icon: Leaf,
    title: "Environmental Impact",
    description:
      "Every feature we build is designed to maximize positive environmental impact and make sustainability accessible to everyone.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We believe in the power of collective action. Our platform connects individuals working towards a common goal.",
  },
  {
    icon: Target,
    title: "Data-Driven",
    description:
      "We use scientific methodologies and verified data sources to ensure accurate carbon footprint calculations.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "Climate change is a global challenge that requires global solutions. We're building for users worldwide.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Leaf className="h-8 w-8 text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Our Mission
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Making Carbon Tracking
              <span className="text-green-600"> Accessible to Everyone</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to democratize carbon tracking and empower individuals to take meaningful action
              against climate change. Every small step counts, and together we can make a big difference.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">890K</div>
                <div className="text-sm text-gray-600">Tons CO₂ Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">127</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">2023</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-xl text-gray-600">How CarbonWise came to be</p>
            </div>

            <div className="prose prose-lg mx-auto text-gray-700">
              <p>
                CarbonWise was born out of frustration. As environmental scientists and engineers, we saw the urgent
                need for climate action, but existing carbon tracking tools were either too complex, too expensive, or
                simply not engaging enough for everyday people.
              </p>

              <p>
                In 2023, our founders Sarah and Marcus decided to change that. They envisioned a platform that would
                make carbon tracking as simple as checking your bank balance, while providing the scientific accuracy
                needed to drive real change.
              </p>

              <p>
                Today, CarbonWise serves over 50,000 users across 127 countries, helping them collectively reduce their
                carbon footprint by nearly 900,000 tons of CO₂. But we're just getting started.
              </p>

              <p>
                Our vision is a world where everyone has the tools and knowledge to make environmentally conscious
                decisions every day. We believe that by making sustainability accessible, actionable, and rewarding, we
                can accelerate the transition to a low-carbon future.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <value.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                    </div>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600">The people behind CarbonWise</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-green-600">{member.avatar}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-green-200" />
              <Award className="h-6 w-6 text-yellow-300" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Join Our Mission</h2>

            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Ready to make a difference? Join thousands of users who are actively reducing their carbon footprint and
              creating positive environmental impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth?tab=signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
