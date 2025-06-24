"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Leaf } from "lucide-react"

interface Activity {
  id: string
  name: string
  carbon_amount: number
  date: string
  category: {
    name: string
    icon: string
    color: string
  }
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent Activities</CardTitle>
          <CardDescription className="text-sm">Your eco-friendly activities will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Leaf className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">No activities logged yet.</p>
            <p className="text-xs sm:text-sm">Start tracking your carbon footprint reduction!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Recent Activities</CardTitle>
        <CardDescription className="text-sm">Your latest eco-friendly actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors gap-2 sm:gap-0"
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg sm:text-xl flex-shrink-0">{activity.category.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm sm:text-base truncate">{activity.name}</div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                    <Badge variant="outline" style={{ borderColor: activity.category.color }} className="text-xs">
                      {activity.category.name}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-green-600 font-medium text-sm sm:text-base ml-8 sm:ml-0">
                <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>{activity.carbon_amount}kg CO₂</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
