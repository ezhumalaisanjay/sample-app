"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Edit, Info, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Update the interface to include the new props
interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  points: number
}

// Add props to the component
export default function OnboardingTaskManager({
  onTaskStatusChange = (id: string, completed: boolean) => {},
  userPoints = 0,
}: {
  onTaskStatusChange?: (id: string, completed: boolean) => void
  userPoints?: number
}) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review project requirements",
      description:
        "Go through all project documentation and make notes of key requirements. Identify any potential issues or questions that need clarification.",
      status: "pending",
      points: 25,
    },
    {
      id: "2",
      title: "Create wireframes",
      description:
        "Design initial wireframes for the main user flows. Focus on layout and functionality rather than visual design at this stage.",
      status: "in-progress",
      points: 25,
    },
    {
      id: "3",
      title: "Set up development environment",
      description:
        "Install all necessary tools and dependencies. Configure version control and set up the project structure according to best practices.",
      status: "completed",
      points: 25,
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  // Calculate level based on points
  const level = Math.floor(userPoints / 100) + 1
  const pointsToNextLevel = 100 - (userPoints % 100)

  // Update the addTask function to include points
  const addTask = () => {
    if (newTaskTitle.trim() === "") return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: "pending",
      points: 25, // Default points for new tasks
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")
    setNewTaskDescription("")
    setIsAddingTask(false)
  }

  // Update the updateTaskStatus function to trigger the callback
  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId)
    const wasCompleted = task?.status === "completed"
    const willBeCompleted = status === "completed"

    // Only trigger the callback if the completed status is changing
    if (wasCompleted !== willBeCompleted) {
      onTaskStatusChange(taskId, willBeCompleted)
    }

    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null)
    }
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "pending":
        return "bg-gray-400 hover:bg-gray-500"
    }
  }

  // Add a function to get the estimated completion date
  const getEstimatedCompletionDate = () => {
    const completionRate = tasks.length > 0 ? completedTasks / tasks.length : 0
    if (completionRate === 0) return "Not started"
    if (completionRate === 1) return "Completed"

    // Estimate days remaining based on current progress
    const totalDays = 14 // Assuming 2 weeks for onboarding
    const daysRemaining = Math.ceil(totalDays * (1 - completionRate))

    const date = new Date()
    date.setDate(date.getDate() + daysRemaining)

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="w-full max-w-3xl mx-auto lg:p-6 space-y-8">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Onboarding Tasks</h1>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              {completedTasks} of {tasks.length} completed
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>Started: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span>Est. Completion: {getEstimatedCompletionDate()}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary px-2">
                Level {level}
              </Badge>
              <span className="text-xs text-muted-foreground">{pointsToNextLevel} points to next level</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{userPoints} points</span>
            </div>
          </div>
        </CardHeader>
        <div className="px-4 py-2 bg-muted/30 border-y">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Progress:</span>
              <span className="text-sm">{Math.round(progressPercentage)}%</span>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-xs">Pending ({tasks.filter((t) => t.status === "pending").length})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">In Progress ({tasks.filter((t) => t.status === "in-progress").length})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Completed ({tasks.filter((t) => t.status === "completed").length})</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="pt-4">
          {!isAddingTask ? (
            <Button
              onClick={() => setIsAddingTask(true)}
              className="w-full flex items-center justify-center gap-2 py-6 border-2 border-dashed border-muted-foreground/20 bg-muted/50 hover:bg-muted"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add New Task</span>
            </Button>
          ) : (
            <Card className="border-2 border-primary/20 mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="font-medium text-lg"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Task description (optional)..."
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={addTask}>Add Task</Button>
              </CardFooter>
            </Card>
          )}

          <div className="space-y-4 mt-6">
            {tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Info className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No tasks yet. Add your first onboarding task to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    data-task-id={task.id}
                    className={cn(
                      "transition-all duration-200 overflow-hidden",
                      task.status === "completed" && "animate-pulse-once border-green-200",
                      expandedTaskId === task.id ? "shadow-lg" : "shadow hover:shadow-md",
                    )}
                  >
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 mb-3 flex-1">
                          <Badge className={cn("mt-1 px-3 py-1 text-nowrap text-white", getStatusColor(task.status))}>
                            {task.status === "in-progress"
                              ? "In Progress"
                              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                          <div>
                            <h3
                              className={cn(
                                "font-medium transition-colors text-lg",
                                task.status === "completed" && "text-muted-foreground line-through",
                              )}
                            >
                              {task.title}
                            </h3>
                            {expandedTaskId !== task.id && task.description && (
                              <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTaskExpansion(task.id)}
                          className="h-8 w-8 text-muted-foreground"
                        >
                          {expandedTaskId === task.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    {expandedTaskId === task.id && (
                      <CardContent className="px-4 pt-4">
                        <div className="pl-10 pr-2">
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {task.description || "No description provided."}
                          </p>
                        </div>
                      </CardContent>
                    )}

                    <CardFooter
                      className={cn(
                        "flex items-center justify-between p-4",
                        expandedTaskId === task.id ? "pt-2" : "pt-0",
                      )}
                    >
                      <div className="pl-10">
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => openTaskDetails(task)}>
                          <Edit className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          defaultValue={task.status}
                          onValueChange={(value) => updateTaskStatus(task.id, value as Task["status"])}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete task</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>View the complete details of this task.</DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Status</h3>
                <Badge className={cn("px-3 py-1 text-white", getStatusColor(selectedTask.status))}>
                  {selectedTask.status === "in-progress"
                    ? "In Progress"
                    : selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Title</h3>
                <p>{selectedTask.title}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm">Description</h3>
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="whitespace-pre-line">{selectedTask.description || "No description provided."}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

