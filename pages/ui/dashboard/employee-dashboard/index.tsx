"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Briefcase, Download, Edit, User, UserCheck, Calendar, Target, Star } from "lucide-react"
import { EditProfileDialog } from "@/components/custom/edit-profile-dialog"
import { PersonalInformationTab } from "@/components/custom/personal-information-tab"
import { JobInformationTab } from "@/components/custom/job-information-tab"
import { LeaveAttendanceTab } from "@/components/custom/leave-attendance-tab"
import { PerformanceReviewsTab } from "@/components/custom/performance-reviews-tab"
import { DocumentsTab } from "@/components/custom/documents-tab"
import { CompensationBenefitsTab } from "@/components/custom/compensation-benefits-tab"
import { NotesHistoryTab } from "@/components/custom/notes-history-tab"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import OnboardingTaskManager from "../../onboarding/task-manager"
import BadgesGrid from "../../onboarding/badges"
// Import the toast component
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

// Placeholder function for access control
const hasAccess = (section: string) => {
  // In a real application, this would check the user's role and permissions
  return true
}

const employeeData = {
  id: "EMP001",
  name: "Sarah Anderson",
  employeeId: "SA12345",
  role: "Senior Software Engineer",
  department: "Engineering",
  squad: "Frontend Team",
  manager: "John Doe",
  status: "Active",
  email: "sarah.anderson@company.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "March 15, 2021",
}

// Replace the existing useState declarations with this expanded version
export default function EmployeeProfileDashboard() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userPoints, setUserPoints] = useState(120)
  const [previousLevel, setPreviousLevel] = useState(Math.floor(120 / 100) + 1)
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [recentAchievements, setRecentAchievements] = useState<{ id: string; title: string; timestamp: Date }[]>([])
  const { toast } = useToast()

  // Add this useEffect to track level changes and show notifications
  useEffect(() => {
    const currentLevel = Math.floor(userPoints / 100) + 1

    // Check if user leveled up
    if (currentLevel > previousLevel) {
      setShowLevelUpAnimation(true)

      // Show toast notification for level up
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached Level ${currentLevel}!`,
        variant: "default",
        duration: 5000,
        action: <ToastAction altText="View Rewards">View Rewards</ToastAction>,
      })

      setTimeout(() => setShowLevelUpAnimation(false), 3000)
    }

    setPreviousLevel(currentLevel)
  }, [userPoints, previousLevel, toast])

  // Update the handleTaskCompletion function to include achievement tracking
  const handleTaskCompletion = (taskId: string, isCompleted: boolean) => {
    // Award points when a task is completed
    if (isCompleted) {
      setUserPoints((prev) => prev + 25)

      // Add to recent achievements
      const task = document.querySelector(`[data-task-id="${taskId}"]`)?.textContent || "Task"
      setRecentAchievements((prev) => [
        { id: taskId, title: `Completed: ${task}`, timestamp: new Date() },
        ...prev.slice(0, 4), // Keep only the 5 most recent achievements
      ])

      // Show toast notification
      toast({
        title: "Task Completed!",
        description: "+25 points awarded",
        variant: "default",
      })
    } else {
      // Remove points if a task is uncompleted
      setUserPoints((prev) => Math.max(0, prev - 25))
    }
  }

  // Add this function to check if a badge was just unlocked
  const handleBadgeUnlock = (badgeId: string, badgeTitle: string) => {
    // Add to recent achievements
    setRecentAchievements((prev) => [
      { id: badgeId, title: `Badge Unlocked: ${badgeTitle}`, timestamp: new Date() },
      ...prev.slice(0, 4), // Keep only the 5 most recent achievements
    ])

    // Show toast notification
    toast({
      title: "Badge Unlocked!",
      description: `You've earned the "${badgeTitle}" badge!`,
      variant: "default",
    })
  }

  const handleProfileUpdate = async (updatedData: any) => {
    // In a real application, this would update the employee data in the backend
    console.log("Updated data:", updatedData)
  }

  return (
    <div className="flex-1 space-y-6 md:p-8 pt-6 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>
                <Target className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full lg:max-w-3xl">
              <ScrollArea className="h-[80vh]">
                <div className="flex justify-between items-center px-4 py-2 mb-2">
                  <h3 className="text-lg font-semibold">Onboarding Progress</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Star className="h-3 w-3 mr-1 fill-primary" /> {userPoints} Points
                    </Badge>
                  </div>
                </div>

                {/* Add onboarding progress dashboard */}
                <div className="px-4 mb-6">
                  <Card className="border-primary/20">
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {/* Level progress */}
                        <div className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1">
                                Level {Math.floor(userPoints / 100) + 1}
                              </Badge>
                              {showLevelUpAnimation && (
                                <span className="animate-bounce text-primary font-bold">Level Up!</span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {100 - (userPoints % 100)} points to next level
                            </span>
                          </div>
                          <Progress value={userPoints % 100} className="h-2" />
                        </div>

                        {/* Onboarding sections progress */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Documentation</span>
                              <span>75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Training</span>
                              <span>40%</span>
                            </div>
                            <Progress value={40} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Team Integration</span>
                              <span>60%</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>

                        {/* Recent achievements */}
                        {recentAchievements.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recent Achievements</h4>
                            <div className="space-y-1">
                              {recentAchievements.map((achievement) => (
                                <div
                                  key={achievement.id + achievement.timestamp.toISOString()}
                                  className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md"
                                >
                                  <span>{achievement.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {achievement.timestamp.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="tasks" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tasks">Onboarding Tasks</TabsTrigger>
                    <TabsTrigger value="badges">Badges & Rewards</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tasks">
                    <OnboardingTaskManager onTaskStatusChange={handleTaskCompletion} userPoints={userPoints} />
                  </TabsContent>
                  <TabsContent value="badges">
                    <BadgesGrid userPoints={userPoints} onBadgeUnlock={handleBadgeUnlock} />
                  </TabsContent>
                </Tabs>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsEditDialogOpen(true)} className="w-full sm:w-auto">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employeeData.avatar} />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{employeeData.name}</CardTitle>
              <CardDescription>{employeeData.role}</CardDescription>
              <div className="mt-2 flex items-center space-x-4">
                <Badge variant="secondary">{employeeData.employeeId}</Badge>
                <Badge variant={employeeData.status === "Active" ? "default" : "destructive"}>
                  {employeeData.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">{employeeData.department}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{employeeData.squad}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span className="text-sm">{employeeData.manager}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Joined {employeeData.joinDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <ScrollArea className="w-full max-w-[100vw]">
            <div className="flex">
              <TabsList className="inline-flex h-auto p-2 items-center justify-start">
                <TabsTrigger
                  value="personal"
                  className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                >
                  Personal Information
                </TabsTrigger>
                <TabsTrigger
                  value="job"
                  className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                >
                  Job Information
                </TabsTrigger>
                <TabsTrigger
                  value="leave"
                  className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                >
                  Leave & Attendance
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                >
                  Performance Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                >
                  Documents
                </TabsTrigger>
                {hasAccess("compensation") && (
                  <TabsTrigger
                    value="compensation"
                    className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    Compensation & Benefits
                  </TabsTrigger>
                )}
                {hasAccess("notes") && (
                  <TabsTrigger
                    value="notes"
                    className="px-3 py-2 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    Notes & History
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="mt-4">
          <TabsContent value="personal" className="mt-0">
            <PersonalInformationTab employeeData={employeeData} />
          </TabsContent>
          <TabsContent value="job" className="mt-0">
            <JobInformationTab employeeData={employeeData} />
          </TabsContent>
          <TabsContent value="leave" className="mt-0">
            <LeaveAttendanceTab employeeData={employeeData} />
          </TabsContent>
          <TabsContent value="performance" className="mt-0">
            <PerformanceReviewsTab employeeData={employeeData} />
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            <DocumentsTab employeeData={employeeData} />
          </TabsContent>
          {hasAccess("compensation") && (
            <TabsContent value="compensation" className="mt-0">
              <CompensationBenefitsTab employeeData={employeeData} />
            </TabsContent>
          )}
          {hasAccess("notes") && (
            <TabsContent value="notes" className="mt-0">
              <NotesHistoryTab employeeData={employeeData} />
            </TabsContent>
          )}
        </div>
      </Tabs>

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={employeeData}
        onSave={handleProfileUpdate}
        onBack={() => setIsEditDialogOpen(false)}
      />
    </div>
  )
}

