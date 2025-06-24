"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarbonChart } from "@/components/carbon-chart"
import { SmartActivityForm } from "@/components/smart-activity-form"
import { BadgesList } from "@/components/badges-list"
import { RecentActivities } from "@/components/recent-activities"
import { Leaf, LogOut, Plus, TrendingDown, Award, Target, Menu, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WeeklyReport } from "@/components/weekly-report"
import { StreakTracker } from "@/components/streak-tracker"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClientWrapper } from "@/components/client-wrapper"
import { DataSourcesPanel } from "@/components/dashboard/data-sources-panel"
import { UserProfileSettings } from "@/components/dashboard/user-profile-settings"

interface Profile {
  id: string
  full_name: string | null
  total_carbon_saved: number
  streak_days: number
}

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

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchProfile = useCallback(async () => {
    if (!user) return

    try {
      console.log("Fetching profile for user:", user.id)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Profile fetch error:", error)
        throw error
      }

      console.log("Profile fetched successfully:", data)
      setProfile(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile data")

      // Create profile if it doesn't exist
      if (error.code === "PGRST116") {
        try {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
              total_carbon_saved: 0,
              streak_days: 0,
            })
            .select()
            .single()

          if (createError) throw createError

          setProfile(newProfile)
          setError(null)
          console.log("Profile created successfully:", newProfile)
        } catch (createError) {
          console.error("Error creating profile:", createError)
        }
      }
    }
  }, [user])

  const fetchActivities = useCallback(async () => {
    if (!user) return

    try {
      console.log("Fetching activities for user:", user.id)

      // First, check if we can connect to the database
      const { data: testData, error: testError } = await supabase.from("activity_categories").select("id").limit(1)

      if (testError) {
        console.error("Database connection test failed:", testError)
        throw new Error("Database connection failed")
      }

      // Fetch activities with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const { data, error } = await supabase
        .from("activities")
        .select(`
          id,
          name,
          carbon_amount,
          date,
          activity_categories (
            name,
            icon,
            color
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

      if (error) {
        console.error("Activities fetch error:", error)
        throw error
      }

      console.log("Activities fetched successfully:", data?.length || 0, "activities")

      const formattedActivities = (data || []).map((activity) => ({
        id: activity.id,
        name: activity.name,
        carbon_amount: activity.carbon_amount,
        date: activity.date,
        category: {
          name: activity.activity_categories?.name || "Unknown",
          icon: activity.activity_categories?.icon || "📝",
          color: activity.activity_categories?.color || "#6b7280",
        },
      }))

      setActivities(formattedActivities)
      setError(null)
      setRetryCount(0)
    } catch (error) {
      console.error("Error fetching activities:", error)

      if (error.name === "AbortError") {
        setError("Request timed out. Please check your internet connection.")
      } else if (error.message?.includes("Failed to fetch")) {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError("Failed to load activities. Please try again.")
      }

      // Don't clear activities on error, keep showing cached data
      if (activities.length === 0) {
        setActivities([])
      }
    } finally {
      setLoading(false)
    }
  }, [user, activities.length])

  const retryFetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setRetryCount((prev) => prev + 1)

    try {
      await Promise.all([fetchProfile(), fetchActivities()])
    } catch (error) {
      console.error("Retry failed:", error)
    }
  }, [fetchProfile, fetchActivities])

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchActivities()

      // Set up real-time subscription with error handling
      let subscription: any = null
      let profileSubscription: any = null

      try {
        subscription = supabase
          .channel("activities_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "activities",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              console.log("Real-time update received:", payload)
              fetchProfile()
              fetchActivities()
            },
          )
          .subscribe((status) => {
            console.log("Activities subscription status:", status)
          })

        profileSubscription = supabase
          .channel("profile_changes")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              console.log("Profile update received:", payload)
              fetchProfile()
            },
          )
          .subscribe((status) => {
            console.log("Profile subscription status:", status)
          })
      } catch (error) {
        console.error("Error setting up real-time subscriptions:", error)
      }

      return () => {
        try {
          subscription?.unsubscribe()
          profileSubscription?.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing:", error)
        }
      }
    }
  }, [user, fetchProfile, fetchActivities])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      })
    }
  }

  const handleActivityAdded = () => {
    setShowActivityForm(false)
    toast({
      title: "Activity logged!",
      description: "Your carbon footprint has been updated.",
    })
    // Force refresh data
    setTimeout(() => {
      fetchProfile()
      fetchActivities()
    }, 1000) // Small delay to allow database to update
  }

  if (loading && !profile && activities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          {retryCount > 0 && <p className="text-sm text-gray-500 mt-2">Retry attempt {retryCount}</p>}
        </div>
      </div>
    )
  }

  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="h-6 w-6 text-green-600" />
          <h2 className="text-lg font-bold">CarbonWise</h2>
        </div>
        <div className="space-y-4">
          <Button onClick={() => setShowActivityForm(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Quick Stats</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">CO₂ Saved:</span>
                <span className="text-sm font-semibold text-green-600">
                  {profile?.total_carbon_saved?.toFixed(1) || "0.0"} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Streak:</span>
                <span className="text-sm font-semibold text-orange-600">{profile?.streak_days || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Activities:</span>
                <span className="text-sm font-semibold text-blue-600">{activities.length}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Enhanced mobile responsiveness with proper sign out button */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <MobileNav />
              <Leaf className="h-4 w-4 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600 flex-shrink-0" />
              <h1 className="text-xs sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 truncate">
                CarbonWise
              </h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
              <span className="text-xs text-gray-600 hidden lg:block max-w-[100px] xl:max-w-none truncate">
                Welcome, {profile?.full_name || user?.email?.split("@")[0] || "User"}!
              </span>
              {/* Enhanced Sign Out Button with proper responsive design */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Sign Out</span>
                <span className="xs:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6 xl:py-8 max-w-7xl mx-auto min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={retryFetch} disabled={loading}>
                {loading ? "Retrying..." : "Retry"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards - Enhanced mobile layout */}
        <ClientWrapper
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="col-span-1">
                  <CardContent className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-xs sm:text-sm font-medium">Carbon Saved</CardTitle>
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  {profile?.total_carbon_saved?.toFixed(1) || "0.0"}
                </div>
                <p className="text-xs text-muted-foreground">kg CO₂</p>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-xs sm:text-sm font-medium">Streak</CardTitle>
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                  {profile?.streak_days || 0}
                </div>
                <p className="text-xs text-muted-foreground">days</p>
              </CardContent>
            </Card>

            <Card className="col-span-2 sm:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-xs sm:text-sm font-medium">Activities</CardTitle>
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{activities.length}</div>
                <p className="text-xs text-muted-foreground">logged</p>
              </CardContent>
            </Card>
          </div>
        </ClientWrapper>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3">
                  <TabsList className="grid w-full grid-cols-4 sm:w-auto h-8 sm:h-10">
                    <TabsTrigger value="overview" className="text-xs px-1 sm:px-3">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="text-xs px-1 sm:px-3">
                      Activities
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="text-xs px-1 sm:px-3">
                      Reports
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="text-xs px-1 sm:px-3">
                      Profile
                    </TabsTrigger>
                  </TabsList>

                  <Button
                    onClick={() => setShowActivityForm(true)}
                    className="w-full sm:w-auto text-xs px-3 py-2 h-8 sm:h-10"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden xs:inline">Log Activity</span>
                    <span className="xs:hidden">Log</span>
                  </Button>
                </div>
              </div>

              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Carbon Footprint Overview</CardTitle>
                    <CardDescription className="text-sm">Your carbon emissions by category over time</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <CarbonChart userId={user?.id || ""} />
                  </CardContent>
                </Card>

                {activities.length === 0 && !loading && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                      <Leaf className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Start Your Eco Journey!</h3>
                      <p className="text-gray-600 text-center mb-4 text-sm sm:text-base px-4">
                        Log your first eco-friendly activity to see your carbon footprint reduction in action.
                      </p>
                      <Button onClick={() => setShowActivityForm(true)} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Log Your First Activity
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activities" className="space-y-4 sm:space-y-6">
                <RecentActivities activities={activities} />
              </TabsContent>

              <TabsContent value="reports" className="space-y-4 sm:space-y-6">
                <WeeklyReport userId={user?.id || ""} />
              </TabsContent>

              <TabsContent value="profile" className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profile Management</CardTitle>
                    <CardDescription className="text-sm">Manage your account settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserProfileSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <StreakTracker userId={user?.id || ""} />
            <BadgesList userId={user?.id || ""} />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Sources</CardTitle>
                <CardDescription className="text-sm">Connect your apps for automatic tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <DataSourcesPanel />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Settings</CardTitle>
                <CardDescription className="text-sm">Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileSettings />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Activity Form Modal */}
      {showActivityForm && (
        <SmartActivityForm onClose={() => setShowActivityForm(false)} onActivityAdded={handleActivityAdded} />
      )}
    </div>
  )
}
