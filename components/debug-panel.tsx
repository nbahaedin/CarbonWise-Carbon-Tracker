"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

export function DebugPanel() {
  const { user } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<string>("Not tested")
  const [supabaseUrl, setSupabaseUrl] = useState<string>("")
  const [hasAnonKey, setHasAnonKey] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const testConnection = async () => {
    const results: string[] = []

    try {
      setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set")
      setHasAnonKey(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Test basic connection
      const { data, error } = await supabase.from("activity_categories").select("count").limit(1)

      if (error) {
        results.push(`❌ Connection Error: ${error.message}`)
        setConnectionStatus(`Error: ${error.message}`)
      } else {
        results.push("✅ Basic connection successful")
        setConnectionStatus("✅ Connected successfully")
      }

      // Test user authentication
      if (user) {
        results.push(`✅ User authenticated: ${user.email}`)

        // Test profile access
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          results.push(`❌ Profile Error: ${profileError.message}`)
        } else {
          results.push(`✅ Profile loaded: ${profile.full_name}`)
        }

        // Test activity templates
        const { data: templates, error: templatesError } = await supabase
          .from("activity_templates")
          .select("count")
          .limit(1)

        if (templatesError) {
          results.push(`❌ Templates Error: ${templatesError.message}`)
        } else {
          results.push("✅ Activity templates accessible")
        }

        // Test emission factors
        const { data: factors, error: factorsError } = await supabase.from("emission_factors").select("count").limit(1)

        if (factorsError) {
          results.push(`❌ Emission Factors Error: ${factorsError.message}`)
        } else {
          results.push("✅ Emission factors accessible")
        }
      } else {
        results.push("⚠️ User not authenticated")
      }

      setTestResults(results)
    } catch (error) {
      results.push(`❌ Exception: ${error}`)
      setTestResults(results)
      setConnectionStatus(`Exception: ${error}`)
    }
  }

  const testActivityInsert = async () => {
    if (!user) {
      setTestResults((prev) => [...prev, "❌ Cannot test insert: User not authenticated"])
      return
    }

    try {
      // Use the new test function instead of direct insert
      const { data, error } = await supabase.rpc("test_activity_insert", {
        test_user_id: user.id,
      })

      if (error) {
        setTestResults((prev) => [...prev, `❌ Test Function Error: ${error.message}`])
        console.error("Test function error:", error)
      } else {
        setTestResults((prev) => [...prev, `✅ ${data}`])
        console.log("Test function result:", data)
      }
    } catch (error) {
      setTestResults((prev) => [...prev, `❌ Test Exception: ${error}`])
      console.error("Test exception:", error)
    }
  }

  const testDirectInsert = async () => {
    if (!user) {
      setTestResults((prev) => [...prev, "❌ Cannot test insert: User not authenticated"])
      return
    }

    try {
      const testActivity = {
        user_id: user.id,
        name: "Direct Test Activity",
        description: "Direct insert test",
        category_id: 1,
        carbon_amount: 1.0,
        date: new Date().toISOString().split("T")[0],
      }

      console.log("Testing direct activity insert:", testActivity)

      const { data, error } = await supabase.from("activities").insert(testActivity).select()

      if (error) {
        setTestResults((prev) => [...prev, `❌ Direct Insert Error: ${error.message}`])
        console.error("Direct insert error details:", error)
      } else {
        setTestResults((prev) => [...prev, `✅ Direct insert successful`])
        console.log("Direct insert successful:", data)

        // Clean up test activity
        if (data && data[0]) {
          await supabase.from("activities").delete().eq("id", data[0].id)
          setTestResults((prev) => [...prev, `🧹 Test activity cleaned up`])
        }
      }
    } catch (error) {
      setTestResults((prev) => [...prev, `❌ Direct Insert Exception: ${error}`])
      console.error("Direct insert exception:", error)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 bg-yellow-50 border-yellow-200 max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Debug Panel
          <Button size="sm" variant="ghost" onClick={clearResults} className="h-6 w-6 p-0">
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Supabase URL:</strong>
          <Badge variant={supabaseUrl ? "default" : "destructive"} className="ml-2">
            {supabaseUrl ? "Set" : "Missing"}
          </Badge>
        </div>
        <div>
          <strong>Anon Key:</strong>
          <Badge variant={hasAnonKey ? "default" : "destructive"} className="ml-2">
            {hasAnonKey ? "Set" : "Missing"}
          </Badge>
        </div>
        <div>
          <strong>Connection:</strong> {connectionStatus}
        </div>

        <div className="space-y-1">
          <Button size="sm" onClick={testConnection} className="w-full text-xs">
            Test Connection
          </Button>
          <Button size="sm" onClick={testActivityInsert} className="w-full text-xs" variant="outline">
            Test Function Insert
          </Button>
          <Button size="sm" onClick={testDirectInsert} className="w-full text-xs" variant="secondary">
            Test Direct Insert
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="mt-2 p-2 bg-white rounded border max-h-32 overflow-y-auto">
            <div className="text-xs font-medium mb-1">Test Results:</div>
            {testResults.map((result, index) => (
              <div key={index} className="text-xs py-1">
                {result}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
