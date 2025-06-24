"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TreePine,
  Zap,
  Wind,
  Droplets,
  Factory,
  MapPin,
  DollarSign,
  CheckCircle,
  Star,
  Users,
  Target,
  Globe,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OffsetProject {
  id: string
  name: string
  type: "forestry" | "renewable" | "technology" | "community"
  description: string
  location: string
  pricePerTon: number
  totalCapacity: number
  currentProgress: number
  rating: number
  reviews: number
  verified: boolean
  impact: string
  timeline: string
  icon: any
  images: string[]
  benefits: string[]
}

const offsetProjects: OffsetProject[] = [
  {
    id: "1",
    name: "Amazon Rainforest Conservation",
    type: "forestry",
    description:
      "Protect 10,000 hectares of Amazon rainforest and support local communities through sustainable forestry practices.",
    location: "Brazil",
    pricePerTon: 12,
    totalCapacity: 50000,
    currentProgress: 78,
    rating: 4.8,
    reviews: 1247,
    verified: true,
    impact: "Protects biodiversity and indigenous communities",
    timeline: "20+ years",
    icon: TreePine,
    images: ["/placeholder.svg?height=200&width=300"],
    benefits: ["Biodiversity protection", "Community support", "Long-term carbon storage"],
  },
  {
    id: "2",
    name: "Solar Farm Development",
    type: "renewable",
    description:
      "Build solar installations in rural communities, providing clean energy and local employment opportunities.",
    location: "India",
    pricePerTon: 8,
    totalCapacity: 25000,
    currentProgress: 45,
    rating: 4.6,
    reviews: 892,
    verified: true,
    impact: "Powers 15,000 homes with clean energy",
    timeline: "25+ years",
    icon: Zap,
    images: ["/placeholder.svg?height=200&width=300"],
    benefits: ["Clean energy generation", "Job creation", "Grid stability"],
  },
  {
    id: "3",
    name: "Wind Energy Project",
    type: "renewable",
    description: "Offshore wind farm generating clean electricity while supporting marine conservation efforts.",
    location: "Denmark",
    pricePerTon: 15,
    totalCapacity: 35000,
    currentProgress: 62,
    rating: 4.9,
    reviews: 654,
    verified: true,
    impact: "Reduces coal dependency by 30%",
    timeline: "30+ years",
    icon: Wind,
    images: ["/placeholder.svg?height=200&width=300"],
    benefits: ["Marine conservation", "Clean energy", "Coastal protection"],
  },
  {
    id: "4",
    name: "Direct Air Capture",
    type: "technology",
    description:
      "Advanced technology that directly removes CO₂ from the atmosphere and stores it permanently underground.",
    location: "Iceland",
    pricePerTon: 25,
    totalCapacity: 15000,
    currentProgress: 23,
    rating: 4.4,
    reviews: 321,
    verified: true,
    impact: "Permanent CO₂ removal from atmosphere",
    timeline: "Permanent",
    icon: Factory,
    images: ["/placeholder.svg?height=200&width=300"],
    benefits: ["Permanent removal", "Scalable technology", "Climate innovation"],
  },
  {
    id: "5",
    name: "Clean Water Initiative",
    type: "community",
    description:
      "Provide clean water access to rural communities while reducing emissions from water treatment and transport.",
    location: "Kenya",
    pricePerTon: 6,
    totalCapacity: 20000,
    currentProgress: 89,
    rating: 4.7,
    reviews: 1156,
    verified: true,
    impact: "Serves 50,000 people with clean water",
    timeline: "15+ years",
    icon: Droplets,
    images: ["/placeholder.svg?height=200&width=300"],
    benefits: ["Health improvement", "Education access", "Economic development"],
  },
]

export function OffsetMarketplace() {
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [userEmissions] = useState(118.4) // kg CO₂ this month
  const [offsetBudget, setOffsetBudget] = useState(50) // USD per month
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  const filteredProjects =
    selectedCategory === "all" ? offsetProjects : offsetProjects.filter((p) => p.type === selectedCategory)

  const addToCart = (projectId: string, tons: number) => {
    setCart((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + tons,
    }))

    toast({
      title: "Added to Cart",
      description: `${tons} tons of CO₂ offset added to your cart.`,
    })
  }

  const calculateCost = (project: OffsetProject, tons: number) => {
    return project.pricePerTon * tons
  }

  const totalCartCost = Object.entries(cart).reduce((total, [projectId, tons]) => {
    const project = offsetProjects.find((p) => p.id === projectId)
    return total + (project ? calculateCost(project, tons) : 0)
  }, 0)

  const totalCartTons = Object.values(cart).reduce((sum, tons) => sum + tons, 0)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "forestry":
        return TreePine
      case "renewable":
        return Zap
      case "technology":
        return Factory
      case "community":
        return Users
      default:
        return Globe
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "forestry":
        return "bg-green-100 text-green-800"
      case "renewable":
        return "bg-blue-100 text-blue-800"
      case "technology":
        return "bg-purple-100 text-purple-800"
      case "community":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 text-sm text-gray-600">
        <h2 className="text-lg font-semibold mb-2">Offset Marketplace</h2>
        <p>Browse verified offset projects and track the impact of your purchases.</p>
      </div>

      {/* Quick Offset Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Quick Offset Calculator</span>
          </CardTitle>
          <CardDescription>Calculate how much it would cost to offset your emissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{userEmissions}</div>
              <div className="text-sm text-gray-600">kg CO₂ to offset</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(userEmissions * 0.012).toFixed(0)} - ${(userEmissions * 0.025).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Estimated cost range</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCartTons.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Tons in cart</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${totalCartCost.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Cart total</div>
            </div>
          </div>

          {totalCartTons > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">
                  You're offsetting {((totalCartTons / userEmissions) * 100).toFixed(0)}% of your emissions
                </span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="forestry">Forestry</TabsTrigger>
          <TabsTrigger value="renewable">Renewable</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const Icon = project.icon
              const TypeIcon = getTypeIcon(project.type)

              return (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getTypeColor(project.type)}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                      </Badge>
                    </div>
                    {project.verified && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{project.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">${project.pricePerTon}/ton</div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {project.rating} ({project.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-700 mb-4">{project.description}</p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Project Progress</span>
                          <span>{project.currentProgress}% funded</span>
                        </div>
                        <Progress value={project.currentProgress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Impact</div>
                          <div className="font-medium">{project.impact}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Timeline</div>
                          <div className="font-medium">{project.timeline}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm font-medium text-gray-900">Key Benefits:</div>
                      <div className="flex flex-wrap gap-1">
                        {project.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => addToCart(project.id, 1)} className="flex-1">
                        Add 1 Ton (${project.pricePerTon})
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToCart(project.id, Math.ceil(userEmissions / 1000))}
                        className="flex-1"
                      >
                        Offset Monthly Emissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Shopping Cart */}
      {Object.keys(cart).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Your Offset Cart</span>
            </CardTitle>
            <CardDescription>Review your selected offset projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(cart).map(([projectId, tons]) => {
                const project = offsetProjects.find((p) => p.id === projectId)
                if (!project) return null

                return (
                  <div key={projectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <project.icon className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-600">
                          {tons} tons × ${project.pricePerTon}/ton
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${calculateCost(project, tons)}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCart((prev) => {
                            const newCart = { ...prev }
                            delete newCart[projectId]
                            return newCart
                          })
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )
              })}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total: {totalCartTons} tons CO₂</span>
                  <span>${totalCartCost.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4" size="lg">
                  Complete Offset Purchase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
