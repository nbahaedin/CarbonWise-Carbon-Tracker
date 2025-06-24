"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Target, Calendar, Trophy } from "lucide-react"

interface StreakData {
  daily_streak: number
  weekly_streak: number
  best_daily_streak: number
  best_weekly_streak: number
  days_this_week: number
  consecutive_weeks: number
}

export function StreakTracker({ userId }: { userId: string }) {
  const [streakData, setStreakData] = useState<StreakData>({
    daily_streak: 0,
    weekly_streak: 0,
    best_daily_streak: 0,
    best_weekly_streak: 0,
    days_this_week: 0,
    consecutive_weeks: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStreakData()
  }, [userId])

  const fetchStreakData = async () => {
    try {
      // Get user's activities for streak calculation
      const { data: activities, error } = await supabase
        .from("activities")
        .select("date")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (error) throw error

      const activityDates = activities.map((a) => new Date(a.date))
      const uniqueDates = [...new Set(activityDates.map((d) => d.toDateString()))]
        .map((d) => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime())

      // Calculate daily streak - Fixed logic
      let dailyStreak = 0
      let bestDailyStreak = 0
      let currentStreak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Check if there's activity today
      const hasActivityToday = uniqueDates.some((date) => {
        const activityDate = new Date(date)
        activityDate.setHours(0, 0, 0, 0)
        return activityDate.getTime() === today.getTime()
      })

      // Calculate consecutive days from today backwards
      const checkDate = new Date(today)
      let foundGap = false

      // If no activity today, start checking from yesterday
      if (!hasActivityToday) {
        checkDate.setDate(today.getDate() - 1)
      }

      // Count consecutive days
      while (!foundGap && currentStreak < uniqueDates.length) {
        const hasActivityOnDate = uniqueDates.some((date) => {
          const activityDate = new Date(date)
          activityDate.setHours(0, 0, 0, 0)
          return activityDate.getTime() === checkDate.getTime()
        })

        if (hasActivityOnDate) {
          currentStreak++
          bestDailyStreak = Math.max(bestDailyStreak, currentStreak)
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          foundGap = true
        }
      }

      dailyStreak = currentStreak

      // Calculate days this week
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())

      const daysThisWeek = uniqueDates.filter((date) => {
        return date >= startOfWeek && date <= today
      }).length

      // Calculate weekly streaks (simplified)
      const weeklyStreak = Math.floor(dailyStreak / 7)
      const bestWeeklyStreak = Math.floor(bestDailyStreak / 7)

      setStreakData({
        daily_streak: dailyStreak,
        weekly_streak: weeklyStreak,
        best_daily_streak: bestDailyStreak,
        best_weekly_streak: bestWeeklyStreak,
        days_this_week: daysThisWeek,
        consecutive_weeks: weeklyStreak,
      })
    } catch (error) {
      console.error("Error fetching streak data:", error)
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
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const weekProgress = (streakData.days_this_week / 7) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Streak Tracker
        </CardTitle>
        <CardDescription>Keep your eco-friendly momentum going!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Daily Streak */}
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">{streakData.daily_streak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
          {streakData.daily_streak > 0 && (
            <Badge className="mt-2 bg-orange-100 text-orange-800">
              <Flame className="h-3 w-3 mr-1" />
              On Fire!
            </Badge>
          )}
        </div>

        {/* This Week Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              This Week
            </span>
            <span>{streakData.days_this_week}/7 days</span>
          </div>
          <Progress value={weekProgress} className="h-2" />
          {streakData.days_this_week === 7 && (
            <Badge className="bg-green-100 text-green-800">
              <Trophy className="h-3 w-3 mr-1" />
              Perfect Week!
            </Badge>
          )}
        </div>

        {/* Personal Records */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{streakData.best_daily_streak}</div>
            <div className="text-xs text-gray-600">Best Daily Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">{streakData.best_weekly_streak}</div>
            <div className="text-xs text-gray-600">Best Weekly Streak</div>
          </div>
        </div>

        {/* Motivational Messages */}
        {streakData.daily_streak === 0 && (
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-blue-800">Start your streak today! Log an eco-friendly activity.</p>
          </div>
        )}

        {streakData.daily_streak >= 7 && (
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Trophy className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm text-green-800">Amazing! You've been consistent for a week!</p>
          </div>
        )}

        {streakData.daily_streak >= 30 && (
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-sm text-purple-800">Incredible! 30+ days of eco-friendly habits!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
