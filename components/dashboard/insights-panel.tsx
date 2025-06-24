"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  Thermometer,
  Car,
  Utensils,
  ShoppingBag,
  Zap,
} from "lucide-react"

interface Insight {
  id: string
  type: "warning" | "tip" | "achievement" | "trend"
  title: string
  description: string
  impact: string
  category: string
  priority: "high" | "medium" | "low"
  actionable: boolean
}

interface EmissionSource {
  category: string
  amount: number
  percentage: number
  trend: number
  color: string
  icon: any
}

const insights: Insight[] = [
  {
    id: "1",
    type: "warning",
    title: "Transportation Spike Detected",
    description: "Your transportation emissions increased by 35% this month compared to last month.",
    impact: "12.5 kg CO₂ increase",
    category: "Transportation",
    priority: "high",
    actionable: true,
  },
  {
    id: "2",
    type: "tip",
    title: "Switch to LED Bulbs",
    description: "Replacing 5 incandescent bulbs with LEDs could save you 45 kg CO₂ annually.",
    impact: "45 kg CO₂/year savings",
    category: "Energy",
    priority: "medium",
    actionable: true,
  },
  {
    id: "3",
    type: "achievement",
    title: "Great Progress on Diet!",
    description: "You've reduced food-related emissions by 20% through plant-based meals.",
    impact: "8.2 kg CO₂ saved",
    category: "Food",
    priority: "low",
    actionable: false,
  },
  {
    id: "4",
    type: "trend",
    title: "Seasonal Energy Pattern",
    description: "Your heating usage typically increases 40% in winter months.",
    impact: "Predictive insight",
    category: "Energy",
    priority: "medium",
    actionable: true,
  },
]

const emissionSources: EmissionSource[] = [
  {
    category: "Transportation",
    amount: 45.2,
    percentage: 38,
    trend: 12,
    color: "#ef4444",
    icon: Car,
  },
  {
    category: "Energy",
    amount: 32.8,
    percentage: 28,
    trend: -5,
    color: "#f59e0b",
    icon: Zap,
  },
  {
    category: "Food",
    amount: 28.1,
    percentage: 24,
    trend: -15,
    color: "#10b981",
    icon: Utensils,
  },
  {
    category: "Shopping",
    amount: 12.3,
    percentage: 10,
    trend: 8,
    color: "#8b5cf6",
    icon: ShoppingBag,
  },
]

const monthlyTrends = [
  { month: "Jan", emissions: 95.2, budget: 100 },
  { month: "Feb", emissions: 88.7, budget: 100 },
  { month: "Mar", emissions: 102.1, budget: 100 },
  { month: "Apr", emissions: 78.9, budget: 100 },
  { month: "May", emissions: 85.4, budget: 100 },
  { month: "Jun", emissions: 92.3, budget: 100 },
]

export function InsightsPanel() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")
  const [carbonBudget] = useState(100) // kg CO₂ per month
  const currentEmissions = 118.4 // kg CO₂ this month

  const budgetProgress = (currentEmissions / carbonBudget) * 100
  const isOverBudget = currentEmissions > carbonBudget

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle
      case "tip":
        return Lightbulb
      case "achievement":
        return Target
      case "trend":
        return TrendingUp
      default:
        return Lightbulb
    }
  }

  const getInsightColor = (type: string, priority: string) => {
    if (type === "warning") return "border-red-200 bg-red-50"
    if (type === "achievement") return "border-green-200 bg-green-50"
    if (priority === "high") return "border-orange-200 bg-orange-50"
    return "border-blue-200 bg-blue-50"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insights & Analytics</h2>
          <p className="text-gray-600">Personalized recommendations and emission analysis</p>
        </div>
        <div className="flex space-x-2">
          {["week", "month", "year"].map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Carbon Budget Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Carbon Budget Tracker</span>
          </CardTitle>
          <CardDescription>Track your progress against your monthly CO₂ goal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Month Progress</span>
              <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                {currentEmissions.toFixed(1)} / {carbonBudget} kg CO₂
              </Badge>
            </div>
            <Progress value={Math.min(budgetProgress, 100)} className={`h-3 ${isOverBudget ? "bg-red-100" : ""}`} />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                  {budgetProgress.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Used</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(0, carbonBudget - currentEmissions).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {isOverBudget ? "+" : ""}
                  {(currentEmissions - carbonBudget).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">vs Budget</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Emission Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Emission Sources</CardTitle>
            <CardDescription>Your biggest carbon contributors this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emissionSources.map((source, index) => (
                <div key={source.category} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: source.color + "20" }}
                    >
                      <source.icon className="h-4 w-4" style={{ color: source.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{source.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">{source.amount} kg</span>
                          <div
                            className={`flex items-center space-x-1 ${source.trend > 0 ? "text-red-500" : "text-green-500"}`}
                          >
                            {source.trend > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span className="text-xs">{Math.abs(source.trend)}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={source.percentage} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Emission Trends</CardTitle>
            <CardDescription>Your carbon footprint over time vs budget</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                emissions: { label: "Emissions", color: "hsl(var(--chart-1))" },
                budget: { label: "Budget", color: "hsl(var(--chart-2))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="emissions" stroke="var(--color-emissions)" strokeWidth={2} />
                  <Line type="monotone" dataKey="budget" stroke="var(--color-budget)" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
          <CardDescription>AI-powered recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type)
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type, insight.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600">{insight.impact}</span>
                        {insight.actionable && (
                          <Button size="sm" variant="outline" className="text-xs">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Seasonal Patterns</span>
          </CardTitle>
          <CardDescription>How your emissions change throughout the year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Winter Pattern</h4>
              <p className="text-sm text-blue-700">Heating increases emissions by 40%</p>
              <p className="text-xs text-blue-600 mt-1">Dec - Feb</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Summer Travel</h4>
              <p className="text-sm text-green-700">Transportation peaks in July</p>
              <p className="text-xs text-green-600 mt-1">Jun - Aug</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <ShoppingBag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-orange-900">Holiday Shopping</h4>
              <p className="text-sm text-orange-700">Shopping emissions spike 60%</p>
              <p className="text-xs text-orange-600 mt-1">Nov - Dec</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Tips Placeholder */}
      <div className="p-4 text-sm text-gray-600">
        <h2 className="text-lg font-semibold mb-2">Insights & Tips</h2>
        <p>Personalised recommendations and a carbon budget tracker will appear here.</p>
      </div>
    </div>
  )
}
