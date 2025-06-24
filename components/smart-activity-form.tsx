"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Lightbulb, Leaf, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ActivityTemplate {
  id: number
  name: string
  description: string
  unit: string
  icon: string
  category_id: number
  emission_factor_id: number
  category: {
    name: string
    color: string
  }
  emission_factor: {
    co2_per_unit: number
    description: string
  }
}

interface Tip {
  id: number
  title: string
  content: string
}

interface SmartActivityFormProps {
  onClose: () => void
  onActivityAdded: () => void
}

export function SmartActivityForm({ onClose, onActivityAdded }: SmartActivityFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<ActivityTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ActivityTemplate | null>(null)
  const [quantity, setQuantity] = useState<string>("1")
  const [description, setDescription] = useState("")
  const [calculatedCO2, setCalculatedCO2] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [showTip, setShowTip] = useState<Tip | null>(null)
  const [step, setStep] = useState<"select" | "input" | "tip">("select")

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    if (selectedTemplate && quantity) {
      const qty = Number.parseFloat(quantity) || 0
      const co2 = qty * selectedTemplate.emission_factor.co2_per_unit
      setCalculatedCO2(co2)
    }
  }, [selectedTemplate, quantity])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_templates")
        .select(`
          *,
          activity_categories (
            name,
            color
          ),
          emission_factors (
            co2_per_unit,
            description
          )
        `)
        .order("category_id")

      if (error) throw error

      const formattedTemplates = data.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        unit: template.unit,
        icon: template.icon,
        category_id: template.category_id,
        emission_factor_id: template.emission_factor_id,
        category: {
          name: template.activity_categories.name,
          color: template.activity_categories.color,
        },
        emission_factor: {
          co2_per_unit: template.emission_factors.co2_per_unit,
          description: template.emission_factors.description,
        },
      }))

      setTemplates(formattedTemplates)
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to load activity templates. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTemplateSelect = (template: ActivityTemplate) => {
    setSelectedTemplate(template)
    setStep("input")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedTemplate) return

    setLoading(true)
    try {
      console.log("Submitting activity:", {
        user_id: user.id,
        name: selectedTemplate.name,
        category_id: selectedTemplate.category_id,
        carbon_amount: calculatedCO2,
        quantity: Number.parseFloat(quantity),
        unit: selectedTemplate.unit,
        emission_factor_id: selectedTemplate.emission_factor_id,
      })

      // Insert activity with auto-calculated CO2
      const { data, error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          name: selectedTemplate.name,
          description: description || null,
          category_id: selectedTemplate.category_id,
          carbon_amount: calculatedCO2,
          quantity: Number.parseFloat(quantity),
          unit: selectedTemplate.unit,
          emission_factor_id: selectedTemplate.emission_factor_id,
          auto_calculated: true,
          date: new Date().toISOString().split("T")[0],
        })
        .select()

      if (error) {
        console.error("Database error details:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("Activity added successfully:", data)

      // Show success message
      toast({
        title: "Activity logged!",
        description: `You saved ${calculatedCO2.toFixed(2)} kg CO₂`,
      })

      // Fetch a relevant tip
      await fetchTip()
      setStep("tip")
    } catch (error) {
      console.error("Error adding activity:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTip = async () => {
    try {
      const { data, error } = await supabase
        .from("tips")
        .select("*")
        .eq("category_id", selectedTemplate?.category_id)
        .eq("tip_type", "post_activity")
        .limit(1)

      if (error) throw error
      if (data && data.length > 0) {
        setShowTip(data[0])
      }
    } catch (error) {
      console.error("Error fetching tip:", error)
    }
  }

  const handleFinish = () => {
    onActivityAdded()
  }

  const groupedTemplates = templates.reduce(
    (acc, template) => {
      const category = template.category.name
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(template)
      return acc
    },
    {} as Record<string, ActivityTemplate[]>,
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
                Smart Activity Logger
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Choose an activity and we'll automatically calculate your carbon impact!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto px-1">
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                <div key={category}>
                  <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2 flex-wrap">
                    <span>{categoryTemplates[0]?.category.name}</span>
                    <Badge style={{ backgroundColor: categoryTemplates[0]?.category.color }} className="text-xs">
                      {categoryTemplates.length} options
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <span className="text-xl sm:text-2xl flex-shrink-0">{template.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm sm:text-base line-clamp-2">{template.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                                {template.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {template.emission_factor.co2_per_unit}kg CO₂ per {template.unit}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "input" && selectedTemplate && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Button variant="ghost" size="sm" onClick={() => setStep("select")} className="p-1 h-auto">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-xl sm:text-2xl">{selectedTemplate.icon}</span>
                <span className="truncate">{selectedTemplate.name}</span>
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">{selectedTemplate.description}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm sm:text-base">
                  Quantity ({selectedTemplate.unit})
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder={`e.g., 5 ${selectedTemplate.unit}`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Any additional details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="text-sm sm:text-base resize-none"
                />
              </div>

              {calculatedCO2 > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      <span className="font-semibold text-green-800 text-sm sm:text-base">Carbon Impact</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {calculatedCO2.toFixed(2)} kg CO₂ saved
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      {selectedTemplate.emission_factor.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("select")}
                  className="order-2 sm:order-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading || !quantity} className="order-1 sm:order-2">
                  {loading ? "Logging Activity..." : "Log Activity"}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "tip" && showTip && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                <span className="truncate">{showTip.title}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3 sm:p-4">
                  <p className="text-blue-800 text-sm sm:text-base">{showTip.content}</p>
                </CardContent>
              </Card>

              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">🎉</div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-1">
                  Great job! You saved {calculatedCO2.toFixed(2)} kg CO₂
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">Keep up the amazing work for our planet!</p>
              </div>

              <Button onClick={handleFinish} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
