"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Users, Globe, MapPin, Trophy, TrendingDown, Target, Award, Crown, Medal } from "lucide-react"

interface BenchmarkData {
  category: string
  userValue: number
  localAverage: number
  nationalAverage: number
  globalAverage: number
  unit: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  reduction: number
  streak: number
  badge: string
  isUser?: boolean
}

const benchmarkData: BenchmarkData[] = [
  {
    category: "Transportation",
    userValue: 45.2,
    localAverage: 52.8,
    nationalAverage: 58.3,
    globalAverage: 48.7,
    unit: "kg CO₂/month",
  },
  {
    category: "Energy",
    userValue: 32.8,
    localAverage: 38.4,
    nationalAverage: 42.1,
    globalAverage: 35.9,
    unit: "kg CO₂/month",
  },
  {
    category: "Food",
    userValue: 28.1,
    localAverage: 35.2,
    nationalAverage: 38.7,
    globalAverage: 42.3,
    unit: "kg CO₂/month",
  },
  {
    category: "Shopping",
    userValue: 12.3,
    localAverage: 18.6,
    nationalAverage: 22.4,
    globalAverage: 19.8,
    unit: "kg CO₂/month",
  },
]

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "EcoChampion2024", reduction: 67, streak: 89, badge: "Climate Hero" },
  { rank: 2, name: "GreenWarrior", reduction: 58, streak: 76, badge: "Eco Master" },
  { rank: 3, name: "CarbonCrusher", reduction: 52, streak: 65, badge: "Planet Protector" },
  { rank: 4, name: "You", reduction: 45, streak: 23, badge: "Eco Warrior", isUser: true },
  { rank: 5, name: "SustainableSam", reduction: 43, streak: 34, badge: "Green Guardian" },
  { rank: 6, name: "ClimateAction", reduction: 38, streak: 28, badge: "Earth Defender" },
  { rank: 7, name: "EcoFriendly", reduction: 35, streak: 19, badge: "Nature Lover" },
  { rank: 8, name: "GreenLiving", reduction: 32, streak: 15, badge: "Eco Starter" },
]

const radarData = [
  { category: "Transport", user: 85, average: 65 },
  { category: "Energy", user: 78, average: 70 },
  { category: "Food", user: 92, average: 60 },
  { category: "Shopping", user: 88, average: 55 },
  { category: "Waste", user: 75, average: 68 },
  { category: "Overall", user: 84, average: 64 },
]

export function BenchmarkingPanel() {
  const [selectedComparison, setSelectedComparison] = useState("local")
  const [showLeaderboard, setShowLeaderboard] = useState(true)

  const userTotalEmissions = benchmarkData.reduce((sum, item) => sum + item.userValue, 0)
  const averageEmissions = {
    local: benchmarkData.reduce((sum, item) => sum + item.localAverage, 0),
    national: benchmarkData.reduce((sum, item) => sum + item.nationalAverage, 0),
    global: benchmarkData.reduce((sum, item) => sum + item.globalAverage, 0),
  }

  const getPerformanceColor = (userValue: number, compareValue: number) => {
    const ratio = userValue / compareValue
    if (ratio <= 0.8) return "text-green-600"
    if (ratio <= 1.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (userValue: number, compareValue: number) => {
    const ratio = userValue / compareValue
    if (ratio <= 0.7) return { text: "Excellent", color: "bg-green-100 text-green-800" }
    if (ratio <= 0.9) return { text: "Good", color: "bg-blue-100 text-blue-800" }
    if (ratio <= 1.1) return { text: "Average", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Needs Improvement", color: "bg-red-100 text-red-800" }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-sm font-bold text-gray-600">#{rank}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Benchmarking & Community</h2>
          <p className="text-gray-600">Compare your performance and connect with others</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={showLeaderboard ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Community Benchmarking Introduction */}
      <div className="p-4 text-sm text-gray-600">
        <h2 className="text-lg font-semibold mb-2">Community Benchmarking</h2>
        <p>
          Compare your footprint with local, national and global averages. A leaderboard and badges will be added soon.
        </p>
      </div>

      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Your Performance Overview</span>
          </CardTitle>
          <CardDescription>How you compare to others in your area and globally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userTotalEmissions.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Your Total</div>
              <div className="text-xs text-gray-500">kg CO₂/month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{averageEmissions.local.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Local Average</div>
              <div className="text-xs text-gray-500">San Francisco</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{averageEmissions.national.toFixed(1)}</div>
              <div className="text-sm text-gray-600">National Average</div>
              <div className="text-xs text-gray-500">United States</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{averageEmissions.global.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Global Average</div>
              <div className="text-xs text-gray-500">Worldwide</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Detailed comparison across emission categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedComparison} onValueChange={setSelectedComparison}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="local">Local</TabsTrigger>
                <TabsTrigger value="national">National</TabsTrigger>
                <TabsTrigger value="global">Global</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedComparison} className="mt-4">
                <div className="space-y-4">
                  {benchmarkData.map((item) => {
                    const compareValue = item[`${selectedComparison}Average` as keyof BenchmarkData] as number
                    const badge = getPerformanceBadge(item.userValue, compareValue)
                    const improvement = ((compareValue - item.userValue) / compareValue) * 100

                    return (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.category}</span>
                          <Badge className={badge.color}>{badge.text}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>
                                You: {item.userValue} {item.unit}
                              </span>
                              <span>
                                Avg: {compareValue} {item.unit}
                              </span>
                            </div>
                            <Progress value={Math.min((item.userValue / compareValue) * 100, 100)} className="h-2" />
                          </div>
                          <div className={`text-sm font-medium ${improvement > 0 ? "text-green-600" : "text-red-600"}`}>
                            {improvement > 0 ? "↓" : "↑"} {Math.abs(improvement).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Your sustainability score across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                user: { label: "Your Score", color: "hsl(var(--chart-1))" },
                average: { label: "Average", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Your Score"
                    dataKey="user"
                    stroke="var(--color-user)"
                    fill="var(--color-user)"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Average"
                    dataKey="average"
                    stroke="var(--color-average)"
                    fill="var(--color-average)"
                    fillOpacity={0.1}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Community Leaderboard */}
      {showLeaderboard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Community Leaderboard</span>
            </CardTitle>
            <CardDescription>Top performers in carbon reduction this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center space-x-4 p-3 rounded-lg ${
                    entry.isUser ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center w-8">{getRankIcon(entry.rank)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${entry.isUser ? "text-blue-900" : "text-gray-900"}`}>
                        {entry.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {entry.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <TrendingDown className="h-3 w-3 text-green-500" />
                        <span>{entry.reduction}% reduction</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Target className="h-3 w-3 text-orange-500" />
                        <span>{entry.streak} day streak</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join Community Challenges
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regional Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span>Regional Insights</span>
          </CardTitle>
          <CardDescription>How your region compares globally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">San Francisco</h4>
              <p className="text-sm text-green-700">15% below national average</p>
              <p className="text-xs text-green-600 mt-1">Strong public transit</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Your Neighborhood</h4>
              <p className="text-sm text-blue-700">Top 25% in city</p>
              <p className="text-xs text-blue-600 mt-1">Active eco-community</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Your Ranking</h4>
              <p className="text-sm text-purple-700">Top 30% globally</p>
              <p className="text-xs text-purple-600 mt-1">Keep up the great work!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
