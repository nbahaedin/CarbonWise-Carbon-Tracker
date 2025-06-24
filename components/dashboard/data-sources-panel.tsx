"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { CreditCard, MapPin, Thermometer, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DataSource {
  id: string
  name: string
  icon: any
  description: string
  connected: boolean
  lastSync?: string
  dataPoints?: number
  category: string
  status: "active" | "error" | "pending"
}

const dataSources: DataSource[] = [
  {
    id: "google-maps",
    name: "Google Maps",
    icon: MapPin,
    description: "Track transportation patterns",
    connected: true,
    lastSync: "2 hours ago",
    dataPoints: 45,
    category: "Transportation",
    status: "active",
  },
  {
    id: "smart-thermostat",
    name: "Smart Thermostat",
    icon: Thermometer,
    description: "Monitor home energy usage",
    connected: true,
    lastSync: "15 minutes ago",
    dataPoints: 120,
    category: "Energy",
    status: "active",
  },
  {
    id: "bank-transactions",
    name: "Bank Transactions",
    icon: CreditCard,
    description: "Analyze spending patterns",
    connected: false,
    category: "Shopping",
    status: "pending",
  },
]

export function DataSourcesPanel() {
  const { toast } = useToast()
  const [sources, setSources] = useState<DataSource[]>(dataSources)
  const [autoSync, setAutoSync] = useState(true)

  const handleToggleConnection = async (sourceId: string) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === sourceId
          ? { ...source, connected: !source.connected, status: source.connected ? "pending" : "active" }
          : source,
      ),
    )

    toast({
      title: "Connection Updated",
      description: "Data source connection has been updated.",
    })
  }

  const connectedSources = sources.filter((s) => s.connected).length
  const totalSources = sources.length

  return (
    <div className="space-y-4">
      {/* Connection Overview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          <span className="text-sm text-gray-600">Auto-sync</span>
        </div>
        <Badge variant="secondary">
          {connectedSources}/{totalSources} Connected
        </Badge>
      </div>

      <Progress value={(connectedSources / totalSources) * 100} className="h-2" />

      {/* Data Sources List */}
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  source.connected ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <source.icon className={`h-4 w-4 ${source.connected ? "text-green-600" : "text-gray-400"}`} />
              </div>
              <div>
                <div className="font-medium text-sm">{source.name}</div>
                <div className="text-xs text-gray-600">{source.description}</div>
                {source.connected && source.lastSync && (
                  <div className="text-xs text-gray-500">Last sync: {source.lastSync}</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {source.status === "active" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {source.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
              <Button
                variant={source.connected ? "outline" : "default"}
                size="sm"
                onClick={() => handleToggleConnection(source.id)}
              >
                {source.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Source */}
      <Button variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Data Source
      </Button>
    </div>
  )
}
