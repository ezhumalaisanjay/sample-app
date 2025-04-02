"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  BookOpen,
  Users,
  FileText,
  Zap,
  Trophy,
  Star,
  Clock,
  Laptop,
  Target,
  Lightbulb,
  Coffee,
} from "lucide-react"
import { useState, useEffect } from "react"

type BadgeItem = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  unlocked: boolean
  progress?: number
}

// Update the component to accept userPoints as a prop
export default function BadgesGrid({
  userPoints = 0,
  onBadgeUnlock = (id: string, title: string) => {},
}: {
  userPoints?: number
  onBadgeUnlock?: (id: string, title: string) => void
}) {
  // Calculate level based on points
  const level = Math.floor(userPoints / 100) + 1

  // Add state to track previously unlocked badges
  const [previouslyUnlocked, setPreviouslyUnlocked] = useState<string[]>([])

  // Add useEffect to detect newly unlocked badges
  useEffect(() => {
    const currentlyUnlocked = badges.filter((badge) => badge.unlocked).map((badge) => badge.id)

    // Find newly unlocked badges
    const newlyUnlocked = currentlyUnlocked.filter((id) => !previouslyUnlocked.includes(id))

    // Trigger callback for each newly unlocked badge
    newlyUnlocked.forEach((id) => {
      const badge = badges.find((b) => b.id === id)
      if (badge) {
        onBadgeUnlock(badge.id, badge.title)
      }
    })

    // Update previously unlocked badges
    if (newlyUnlocked.length > 0) {
      setPreviouslyUnlocked(currentlyUnlocked)
    }
  }, [userPoints, onBadgeUnlock])

  // Update the badges array to use the level for unlocking logic
  const badges: BadgeItem[] = [
    {
      id: "1",
      title: "First Day Champion",
      description: "Successfully completed your first day of onboarding",
      icon: <Trophy className="h-8 w-8" />,
      color: "bg-amber-500",
      unlocked: true,
    },
    {
      id: "2",
      title: "Paperwork Pro",
      description: "Completed all required HR documentation",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-blue-500",
      unlocked: true,
    },
    {
      id: "3",
      title: "Team Player",
      description: "Met with all team members",
      icon: <Users className="h-8 w-8" />,
      color: "bg-green-500",
      unlocked: userPoints >= 75,
      progress: userPoints >= 75 ? 100 : Math.min(Math.floor((userPoints / 75) * 100), 99),
    },
    {
      id: "4",
      title: "Knowledge Seeker",
      description: "Completed all training modules",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-purple-500",
      unlocked: userPoints >= 150,
      progress: userPoints >= 150 ? 100 : Math.min(Math.floor((userPoints / 150) * 100), 99),
    },
    {
      id: "5",
      title: "Early Bird",
      description: "Arrived on time for all meetings in your first week",
      icon: <Clock className="h-8 w-8" />,
      color: "bg-cyan-500",
      unlocked: userPoints >= 100,
      progress: userPoints >= 100 ? 100 : Math.floor(userPoints),
    },
    {
      id: "6",
      title: "Tech Wizard",
      description: "Set up all required software and tools",
      icon: <Laptop className="h-8 w-8" />,
      color: "bg-indigo-500",
      unlocked: true,
    },
    {
      id: "7",
      title: "Goal Setter",
      description: "Established your 30-60-90 day goals with your manager",
      icon: <Target className="h-8 w-8" />,
      color: "bg-red-500",
      unlocked: userPoints >= 200,
      progress: userPoints >= 200 ? 100 : Math.min(Math.floor((userPoints / 200) * 100), 99),
    },
    {
      id: "8",
      title: "Idea Generator",
      description: "Shared your first idea or suggestion in a team meeting",
      icon: <Lightbulb className="h-8 w-8" />,
      color: "bg-yellow-500",
      unlocked: userPoints >= 250,
      progress: userPoints >= 250 ? 100 : Math.min(Math.floor((userPoints / 250) * 100), 99),
    },
  ]

  // Update the rewards section to use the level for unlocking logic
  // Add this before the return statement
  const rewards = [
    {
      id: "1",
      title: "Team Lunch",
      description: "Unlock at Level 1",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-blue-500",
      unlocked: level >= 1,
    },
    {
      id: "2",
      title: "Company Swag Pack",
      description: "Unlock at Level 2",
      icon: <Award className="h-5 w-5" />,
      color: "bg-green-500",
      unlocked: level >= 2,
    },
    {
      id: "3",
      title: "Coffee Chat with CEO",
      description: "Unlock at Level 3",
      icon: <Coffee className="h-5 w-5" />,
      color: "bg-amber-500",
      unlocked: level >= 3,
    },
  ]

  // Add this timeline section before the return statement
  const milestones = [
    { day: 1, title: "First Day", description: "Complete initial onboarding", completed: true },
    { day: 3, title: "Documentation", description: "Complete all paperwork", completed: true },
    { day: 7, title: "Team Integration", description: "Meet the team", completed: userPoints >= 75 },
    { day: 14, title: "Training", description: "Complete basic training", completed: userPoints >= 150 },
    { day: 30, title: "First Month", description: "Set 30-60-90 day goals", completed: userPoints >= 200 },
    { day: 60, title: "Second Month", description: "Complete advanced training", completed: userPoints >= 300 },
    { day: 90, title: "Third Month", description: "Fully onboarded", completed: userPoints >= 400 },
  ]

  const unlockedBadges = badges.filter((badge) => badge.unlocked).length

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Progress</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1">
              Level {level}
            </Badge>
          </div>
          <CardDescription>Keep completing tasks to earn points and level up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Level {level}</span>
              <span className="text-sm font-medium">Level {level + 1}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${userPoints % 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{userPoints} points</span>
              <span>{Math.floor(userPoints / 100) * 100 + 100} points</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Onboarding Journey</CardTitle>
          <CardDescription>Track your progress through the onboarding process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline track */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

            {/* Timeline items */}
            <div className="space-y-8 relative">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-10">
                  {/* Timeline marker */}
                  <div
                    className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      milestone.completed
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-muted border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-medium">{milestone.day}</span>
                  </div>

                  {/* Content */}
                  <div
                    className={`p-3 rounded-md ${
                      milestone.completed ? "bg-primary/5 border border-primary/20" : "bg-muted/30 border border-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">{milestone.title}</h4>
                      {milestone.completed ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          <Star className="h-3 w-3 mr-1 fill-primary" /> Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Badges & Achievements</CardTitle>
            <div className="text-sm font-medium">
              {unlockedBadges} of {badges.length} unlocked
            </div>
          </div>
          <CardDescription>Earn badges by completing onboarding milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border text-center ${
                  badge.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                }`}
              >
                <div
                  className={`${badge.color} ${
                    badge.unlocked ? "opacity-100" : "opacity-30"
                  } h-16 w-16 rounded-full flex items-center justify-center text-white mb-3`}
                >
                  {badge.icon}
                </div>
                <h4 className="font-medium">{badge.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 mb-2">{badge.description}</p>

                {badge.unlocked ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <Star className="h-3 w-3 mr-1 fill-primary" /> Unlocked
                  </Badge>
                ) : (
                  <div className="w-full space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/50 rounded-full" style={{ width: `${badge.progress || 0}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{badge.progress || 0}% complete</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rewards</CardTitle>
          <CardDescription>Unlock special rewards as you progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  reward.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${reward.color} flex items-center justify-center text-white`}>
                    {reward.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{reward.title}</h4>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={reward.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
                >
                  {reward.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

