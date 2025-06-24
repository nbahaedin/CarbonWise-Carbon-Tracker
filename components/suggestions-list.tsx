"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, Leaf, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Suggestion {
  id: number
  title: string
  description: string
  potential_savings: number
  difficulty: string
  category: {
    name: string
    icon: string
  }
}

export function SuggestionsList() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuggestions = async () => {
    try {
      setError(null)
      console.log("Fetching suggestions...")

      const { data, error } = await supabase
        .from("suggestions")
        .select(`
          *,
          activity_categories (
            name,
            icon
          )
        `)
        .order("potential_savings", { ascending: false })

      if (error) {
        console.error("Suggestions fetch error:", error)
        throw error
      }

      console.log("Suggestions fetched successfully:", data?.length || 0)

      const formattedSuggestions = (data || []).map((suggestion) => ({
        id: suggestion.id,
        title: suggestion.title,
        description: suggestion.description,
        potential_savings: suggestion.potential_savings || 0,
        difficulty: suggestion.difficulty || "medium",
        category: {
          name: suggestion.activity_categories?.name || "General",
          icon: suggestion.activity_categories?.icon || "💡",
        },
      }))

      setSuggestions(formattedSuggestions)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setError("Failed to load suggestions. Please try again.")

      // Set fallback suggestions if fetch fails
      setSuggestions([
        {
          id: 1,
          title: "Walk or bike for short trips",
          description: "Replace car trips under 2km with walking or cycling to reduce emissions and improve health.",
          potential_savings: 2.5,
          difficulty: "easy",
          category: { name: "Transport", icon: "🚗" },
        },
        {
          id: 2,
          title: "Switch to LED bulbs",
          description: "Replace incandescent bulbs with energy-efficient LEDs to save energy and money.",
          potential_savings: 0.5,
          difficulty: "easy",
          category: { name: "Energy", icon: "⚡" },
        },
        {
          id: 3,
          title: "Have one meat-free day per week",
          description: "Reduce meat consumption to lower your carbon footprint and try new recipes.",
          potential_savings: 3.2,
          difficulty: "easy",
          category: { name: "Food", icon: "🍽️" },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Personalized Tips</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Personalized Tips</h2>
        </div>
        {error && (
          <Button variant="outline" size="sm" onClick={fetchSuggestions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{suggestion.category.icon}</span>
                <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getDifficultyColor(suggestion.difficulty)}>{suggestion.difficulty}</Badge>
                <div className="flex items-center text-green-600">
                  <Leaf className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{suggestion.potential_savings}kg CO₂</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-base">{suggestion.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
