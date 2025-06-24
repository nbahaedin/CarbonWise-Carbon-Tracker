"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3, Download, Share2 } from "lucide-react"

interface AnalyticsData {
  monthlyReduction: number
  yearlyProjection: number
  topCategory: string
  improvementAreas: string[]
  comparisonData: {
    lastMonth: number
    thisMonth: number
    trend: "up" | "down"
  }
}

export function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Mock data for now - replace with actual analytics queries
      const mockData: AnalyticsData = {
        monthlyReduction: 45.2,
        yearlyProjection: 542.4,
        topCategory: "Transportation",
        improvementAreas: ["Energy Usage", "Waste Management", "Water Conservation"],
        comparisonData: {
          lastMonth: 38.1,
          thisMonth: 45.2,
          trend: "up",
        },
      }

      setAnalytics(mockData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
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
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) return null

  const improvementPercentage =
    ((analytics.comparisonData.thisMonth - analytics.comparisonData.lastMonth) / analytics.comparisonData.lastMonth) *
    100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
          <CardDescription>Detailed insights into your carbon footprint patterns and trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.monthlyReduction} kg</div>
              <div className="text-sm text-gray-600">CO₂ Reduced This Month</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.yearlyProjection} kg</div>
              <div className="text-sm text-gray-600">Yearly Projection</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{improvementPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Monthly Improvement</div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              {analytics.comparisonData.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              Performance Trend
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Month: {analytics.comparisonData.lastMonth} kg</span>
              <span className="text-sm">This Month: {analytics.comparisonData.thisMonth} kg</span>
            </div>
            <Progress value={(analytics.comparisonData.thisMonth / analytics.yearlyProjection) * 100} className="h-2" />
          </div>

          {/* Top Category */}
          <div className="space-y-2">
            <h4 className="font-semibold">Top Impact Category</h4>
            <Badge variant="secondary" className="text-sm">
              {analytics.topCategory}
            </Badge>
            <p className="text-sm text-gray-600">
              Your biggest carbon reduction impact comes from {analytics.topCategory.toLowerCase()} activities.
            </p>
          </div>

          {/* Improvement Areas */}
          <div className="space-y-2">
            <h4 className="font-semibold">Areas for Improvement</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.improvementAreas.map((area, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
