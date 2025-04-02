"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type GamificationData = {
  totalPoints: number
  level: number
  badges: string[]
  recentActivity: {
    action: string
    points: number
    date: string
  }[]
}

export default function GamificationPage() {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchGamificationData = async () => {
      setIsLoading(true)
      try {
        // In a real application, you would fetch this data from your API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        setGamificationData({
          totalPoints: 750,
          level: 3,
          badges: ["Early Planner", "Team Player", "Consistency King"],
          recentActivity: [
            { action: "Submitted leave request 30 days in advance", points: 100, date: "2023-06-01" },
            { action: "Completed team survey", points: 50, date: "2023-05-28" },
            { action: "Submitted leave request 14 days in advance", points: 50, date: "2023-05-15" },
          ],
        })
      } catch (error) {
        console.error("Failed to fetch gamification data:", error)
        toast({
          title: "Error",
          description: "Failed to load gamification data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGamificationData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!gamificationData) {
    return <div className="text-center p-4">No gamification data available.</div>
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Gamification Progress</h1>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Level {gamificationData.level}</CardTitle>
            <CardDescription>Your current gamification level</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(gamificationData.totalPoints % 1000) / 10} className="w-full" />
            <p className="mt-2 text-sm text-muted-foreground">
              {gamificationData.totalPoints} / 1000 points to next level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Badges Earned</CardTitle>
            <CardDescription>Your achievements so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {gamificationData.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4 sm:mt-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
          <CardDescription>Your latest point-earning actions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 sm:space-y-4">
            {gamificationData.recentActivity.map((activity, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium text-sm sm:text-base">{activity.action}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <Badge variant="default" className="text-xs sm:text-sm">
                  +{activity.points} points
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

