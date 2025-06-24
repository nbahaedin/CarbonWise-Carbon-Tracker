"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Download, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function UserProfileSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    units: "metric",
    currency: "USD",
    notifications: {
      weekly: true,
      monthly: true,
      achievements: true,
    },
  })

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "carbon-tracker-settings.json"
    link.click()

    toast({
      title: "Data Exported",
      description: "Your settings have been downloaded.",
    })
  }

  return (
    <div className="space-y-4">
      {/* Display Preferences */}
      <div className="space-y-3">
        <h4 className="font-medium">Display Preferences</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="units" className="text-sm">
              Units
            </Label>
            <Select value={settings.units} onValueChange={(value) => setSettings({ ...settings, units: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, km)</SelectItem>
                <SelectItem value="imperial">Imperial (lb, miles)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="currency" className="text-sm">
              Currency
            </Label>
            <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Notification Preferences */}
      <div className="space-y-3">
        <h4 className="font-medium">Notifications</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Weekly Reports</Label>
              <p className="text-xs text-gray-600">Receive weekly summaries</p>
            </div>
            <Switch
              checked={settings.notifications.weekly}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, weekly: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Monthly Reports</Label>
              <p className="text-xs text-gray-600">Receive monthly analytics</p>
            </div>
            <Switch
              checked={settings.notifications.monthly}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, monthly: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Achievements</Label>
              <p className="text-xs text-gray-600">Get notified of badges</p>
            </div>
            <Switch
              checked={settings.notifications.achievements}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, achievements: checked },
                })
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={exportData} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={saveSettings} disabled={isLoading} className="flex-1">
          <Settings className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}
