"use client"

import { ClientWrapper } from "@/components/client-wrapper"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface ChartData {
  category: string
  amount: number
  color: string
}

interface MonthlyData {
  month: string
  amount: number
}

const chartConfig = {
  amount: {
    label: "Carbon Amount (kg CO₂)",
    color: "hsl(142, 76%, 36%)", // Use specific green color instead of CSS variable
  },
}

export function CarbonChart({ userId }: { userId: string }) {
  const [categoryData, setCategoryData] = useState<ChartData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchChartData()
  }, [userId])

  const fetchChartData = async () => {
    try {
      // Fetch category data
      const { data: categoryData, error: categoryError } = await supabase
        .from("activities")
        .select(`
          carbon_amount,
          activity_categories (
            name,
            color
          )
        `)
        .eq("user_id", userId)

      if (categoryError) throw categoryError

      // Group by category
      const categoryMap = new Map()
      categoryData.forEach((activity) => {
        const category = activity.activity_categories.name
        const color = activity.activity_categories.color
        const current = categoryMap.get(category) || { amount: 0, color }
        categoryMap.set(category, {
          amount: current.amount + activity.carbon_amount,
          color,
        })
      })

      const formattedCategoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        amount: Number(data.amount.toFixed(1)),
        color: data.color,
      }))

      setCategoryData(formattedCategoryData)

      // Fetch monthly data (last 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const { data: monthlyData, error: monthlyError } = await supabase
        .from("activities")
        .select("carbon_amount, date")
        .eq("user_id", userId)
        .gte("date", sixMonthsAgo.toISOString().split("T")[0])

      if (monthlyError) throw monthlyError

      // Group by month
      const monthMap = new Map()
      monthlyData.forEach((activity) => {
        const date = new Date(activity.date)
        const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        const current = monthMap.get(monthKey) || 0
        monthMap.set(monthKey, current + activity.carbon_amount)
      })

      const formattedMonthlyData = Array.from(monthMap.entries()).map(([month, amount]) => ({
        month,
        amount: Number(amount.toFixed(1)),
      }))

      setMonthlyData(formattedMonthlyData)
    } catch (error) {
      console.error("Error fetching chart data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (categoryData.length === 0 && monthlyData.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-base sm:text-lg mb-2">No data yet</p>
          <p className="text-xs sm:text-sm">Start logging activities to see your carbon footprint!</p>
        </div>
      </div>
    )
  }

  return (
    <ClientWrapper
      fallback={
        <div className="h-48 sm:h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Rest of the existing chart JSX */}
        {/* Category Breakdown - Enhanced mobile responsiveness */}
        {categoryData.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 px-1">Emissions by Category</h3>
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      dataKey="amount"
                      label={({ category, amount, percent }) => {
                        // Show simplified labels on mobile
                        const isMobile = typeof window !== "undefined" && window.innerWidth < 640
                        if (isMobile && percent < 0.1) return "" // Hide very small slices on mobile
                        return isMobile ? `${amount}kg` : `${category}: ${amount}kg`
                      }}
                      labelLine={false}
                      fontSize={12}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [`${value}kg CO₂`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Legend for mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 sm:hidden">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="truncate">{entry.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Trend - Enhanced mobile responsiveness */}
        {monthlyData.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 px-1">Monthly Trend</h3>
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 40,
                    }}
                  >
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: "#374151" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#374151" }} tickLine={false} axisLine={false} width={30} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`${value}kg CO₂`, "Carbon Saved"]}
                    />
                    <Bar dataKey="amount" fill="hsl(142, 76%, 36%)" radius={[2, 2, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}
      </div>
    </ClientWrapper>
  )
}
