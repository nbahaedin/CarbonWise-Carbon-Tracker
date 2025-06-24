"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Environmental Scientist",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    quote:
      "CarbonWise helped me reduce my carbon footprint by 35% in just 6 months. The personalized insights are incredibly valuable.",
    impact: "35% reduction",
    badge: "Top Reducer",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    location: "Austin, TX",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    quote:
      "The gamification aspect keeps me motivated. I've earned 12 badges and my family is now competing to see who can reduce the most!",
    impact: "12 badges earned",
    badge: "Achievement Hunter",
  },
  {
    name: "Elena Rodriguez",
    role: "Teacher",
    location: "Barcelona, Spain",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    quote:
      "I love how easy it is to track everything. The app learns my habits and gives me actionable tips that actually work.",
    impact: "180 days streak",
    badge: "Consistency Champion",
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    location: "Seoul, South Korea",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    quote:
      "The offset marketplace is fantastic. I can see exactly where my money goes and the real impact it's making on the environment.",
    impact: "50 tons offset",
    badge: "Climate Hero",
  },
  {
    name: "Priya Patel",
    role: "Doctor",
    location: "Mumbai, India",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    quote:
      "CarbonWise made me aware of hidden emissions I never considered. Now my whole family is more conscious about our choices.",
    impact: "Family of 4 tracking",
    badge: "Family Leader",
  },
  {
    name: "James Wilson",
    role: "Architect",
    location: "London, UK",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    quote:
      "The detailed analytics help me make informed decisions about my lifestyle. It's like having a personal environmental consultant.",
    impact: "28% reduction",
    badge: "Data Driven",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from people who are making a difference with CarbonWise. Join our community of environmental
            champions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-green-100" />
              </div>
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</blockquote>

                {/* User Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                {/* Impact & Badge */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">Impact: </span>
                    <span className="font-semibold text-green-600">{testimonial.impact}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {testimonial.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-white">
                    <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-gray-600">50,000+ happy users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.9/5 average rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
