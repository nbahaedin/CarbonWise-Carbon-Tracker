"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Plus, CheckCircle, Clock, Calendar, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  category: string
  status: "active" | "completed" | "paused"
  priority: "low" | "medium" | "high"
}

export function GoalsPanel() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetValue: 0,
    unit: "kg CO₂",
    deadline: "",
    category: "reduction",
    priority: "medium" as const,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Reduce Monthly Carbon Footprint",
        description: "Achieve 50kg CO₂ reduction this month",
        targetValue: 50,
        currentValue: 32,
        unit: "kg CO₂",
        deadline: "2024-01-31",
        category: "reduction",
        status: "active",
        priority: "high",
      },
      {
        id: "2",
        title: "Complete 30 Eco Activities",
        description: "Log 30 different eco-friendly activities",
        targetValue: 30,
        currentValue: 18,
        unit: "activities",
        deadline: "2024-02-15",
        category: "activities",
        status: "active",
        priority: "medium",
      },
      {
        id: "3",
        title: "Maintain 7-Day Streak",
        description: "Keep logging activities for 7 consecutive days",
        targetValue: 7,
        currentValue: 7,
        unit: "days",
        deadline: "2024-01-20",
        category: "streak",
        status: "completed",
        priority: "low",
      },
    ]
    setGoals(mockGoals)
  }, [])

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      currentValue: 0,
      status: "active",
    }

    setGoals([...goals, goal])
    setNewGoal({
      title: "",
      description: "",
      targetValue: 0,
      unit: "kg CO₂",
      deadline: "",
      category: "reduction",
      priority: "medium",
    })
    setShowCreateDialog(false)

    toast({
      title: "Goal Created",
      description: "Your new goal has been added successfully!",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "active":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "paused":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Environmental Goals
            </CardTitle>
            <CardDescription>Set and track your sustainability objectives</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Reduce monthly emissions"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="target">Target Value</Label>
                    <Input
                      id="target"
                      type="number"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={newGoal.unit} onValueChange={(value) => setNewGoal({ ...newGoal, unit: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg CO₂">kg CO₂</SelectItem>
                        <SelectItem value="activities">Activities</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="points">Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value: "low" | "medium" | "high") => setNewGoal({ ...newGoal, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateGoal} className="flex-1">
                    Create Goal
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
            <p className="text-gray-600 mb-4">Create your first environmental goal to start tracking progress</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentValue / goal.targetValue) * 100
              const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== "completed"

              return (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(goal.status)}
                        <h4 className="font-semibold">{goal.title}</h4>
                        <Badge className={`text-xs ${getPriorityColor(goal.priority)}`}>{goal.priority}</Badge>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                        <span>
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
