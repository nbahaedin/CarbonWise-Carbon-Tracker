"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Lock } from "lucide-react"

interface BadgeData {
  id: number
  name: string
  description: string
  icon: string
  requirement_type: string
  requirement_value: number
  earned: boolean
  earned_at?: string
}

export function BadgesList({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBadges()
  }, [userId])

  const fetchBadges = async () => {
    try {
      // Fetch all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("*")
        .order("requirement_value")

      if (badgesError) throw badgesError

      // Fetch user's earned badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select("badge_id, earned_at")
        .eq("user_id", userId)

      if (userBadgesError) throw userBadgesError

      const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge_id))
      const earnedBadgesMap = new Map(userBadges.map((ub) => [ub.badge_id, ub.earned_at]))

      const formattedBadges = allBadges.map((badge) => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id),
        earned_at: earnedBadgesMap.get(badge.id),
      }))

      setBadges(formattedBadges)
    } catch (error) {
      console.error("Error fetching badges:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const availableBadges = badges.filter((badge) => !badge.earned)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>
          {earnedBadges.length} of {badges.length} badges earned
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h4 className="font-medium text-green-600 mb-3">Earned Badges</h4>
            <div className="space-y-3">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-green-800">{badge.name}</div>
                    <div className="text-sm text-green-600">{badge.description}</div>
                    {badge.earned_at && (
                      <div className="text-xs text-green-500">
                        Earned {new Date(badge.earned_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">Earned</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Badges */}
        {availableBadges.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-600 mb-3">Available Badges</h4>
            <div className="space-y-3">
              {availableBadges.map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg opacity-75">
                  <div className="text-2xl grayscale">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">{badge.name}</div>
                    <div className="text-sm text-gray-600">{badge.description}</div>
                    <div className="text-xs text-gray-500">
                      {badge.requirement_type === "total_saved" && `Save ${badge.requirement_value}kg CO₂`}
                      {badge.requirement_type === "streak" && `${badge.requirement_value} day streak`}
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
