"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { Calendar, TrendingUp, Award } from "lucide-react"

interface WeeklyData {
  week: string
  co2_saved: number
  activities_count: number
}

interface CategoryBreakdown {
  category: string
  amount: number
  color: string
  percentage: number
}

const chartConfig = {
  co2_saved: {
    label: "CO₂ Saved (kg)",
    color: "hsl(var(--chart-1))",
  },
  activities_count: {
    label: "Activities",
    color: "hsl(var(--chart-2))",
  },
}

export function WeeklyReport({ userId }: { userId: string }) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([])
  const [totalCO2ThisWeek, setTotalCO2ThisWeek] = useState(0)
  const [totalActivitiesThisWeek, setTotalActivitiesThisWeek] = useState(0)
  const [weeklyGoal] = useState(20) // 20kg CO2 weekly goal
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeeklyData()
  }, [userId])

  const fetchWeeklyData = async () => {
    try {
      // Get last 8 weeks of data
      const eightWeeksAgo = new Date()
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

      const { data: activities, error } = await supabase
        .from("activities")
        .select(`
          carbon_amount,
          date,
          activity_categories (
            name,
            color
          )
        `)
        .eq("user_id", userId)
        .gte("date", eightWeeksAgo.toISOString().split("T")[0])
        .order("date")

      if (error) throw error

      // Group by week
      const weekMap = new Map()
      const categoryMap = new Map()
      let thisWeekCO2 = 0
      let thisWeekActivities = 0

      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

      activities.forEach((activity) => {
        const activityDate = new Date(activity.date)
        const weekStart = new Date(activityDate)
        weekStart.setDate(activityDate.getDate() - activityDate.getDay())

        const weekKey = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })

        // Weekly data
        const current = weekMap.get(weekKey) || { co2_saved: 0, activities_count: 0 }
        weekMap.set(weekKey, {
          co2_saved: current.co2_saved + activity.carbon_amount,
          activities_count: current.activities_count + 1,
        })

        // Category breakdown
        const category = activity.activity_categories.name
        const categoryData = categoryMap.get(category) || {
          amount: 0,
          color: activity.activity_categories.color,
        }
        categoryMap.set(category, {
          amount: categoryData.amount + activity.carbon_amount,
          color: categoryData.color,
        })

        // This week's totals
        if (weekStart.getTime() === startOfWeek.getTime()) {
          thisWeekCO2 += activity.carbon_amount
          thisWeekActivities += 1
        }
      })

      // Format weekly data
      const formattedWeeklyData = Array.from(weekMap.entries()).map(([week, data]) => ({
        week,
        co2_saved: Number(data.co2_saved.toFixed(1)),
        activities_count: data.activities_count,
      }))

      // Format category breakdown
      const totalCO2 = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.amount, 0)
      const formattedCategoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        amount: Number(data.amount.toFixed(1)),
        color: data.color,
        percentage: Math.round((data.amount / totalCO2) * 100),
      }))

      setWeeklyData(formattedWeeklyData)
      setCategoryBreakdown(formattedCategoryData)
      setTotalCO2ThisWeek(Number(thisWeekCO2.toFixed(1)))
      setTotalActivitiesThisWeek(thisWeekActivities)
    } catch (error) {
      console.error("Error fetching weekly data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = Math.min((totalCO2ThisWeek / weeklyGoal) * 100, 100)

  return (
    <div className="space-y-6">
      {/* This Week Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week's Impact
          </CardTitle>
          <CardDescription>Your carbon footprint reduction progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCO2ThisWeek}kg</div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalActivitiesThisWeek}</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Goal Progress</span>
              <span>
                {totalCO2ThisWeek}/{weeklyGoal}kg
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {progressPercentage >= 100 && (
              <Badge className="bg-green-100 text-green-800">
                <Award className="h-3 w-3 mr-1" />
                Goal Achieved!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              8-Week Trend
            </CardTitle>
            <CardDescription>Your carbon savings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="co2_saved"
                    stroke="var(--color-co2_saved)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-co2_saved)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Where you're making the biggest impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBreakdown.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{category.amount}kg</span>
                    <Badge variant="outline">{category.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
