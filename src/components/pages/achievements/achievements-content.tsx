"use client"

import { useState } from "react"
import { Award, Book, Brain, Clock, FileText, Flame, Sparkles, Star, Trophy, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock achievement data
const mockAchievements = [
  {
    id: "1",
    title: "First Quiz Ace",
    description: "Score 100% on any quiz",
    icon: Star,
    color: "yellow",
    unlocked: true,
    date: "2023-03-20",
    xp: 50,
    category: "quizzes",
  },
  {
    id: "2",
    title: "Library Builder",
    description: "Add 10 documents to your library",
    icon: Book,
    color: "blue",
    unlocked: true,
    date: "2023-03-15",
    xp: 30,
    category: "library",
  },
  {
    id: "3",
    title: "Streak Master",
    description: "Maintain a 7-day study streak",
    icon: Flame,
    color: "orange",
    unlocked: true,
    date: "2023-03-18",
    xp: 70,
    category: "general",
  },
  {
    id: "4",
    title: "Memory Master",
    description: "Create 20 flashcard sets",
    icon: Brain,
    color: "purple",
    unlocked: false,
    progress: 3,
    total: 20,
    xp: 80,
    category: "flashcards",
  },
  {
    id: "5",
    title: "Focus Champion",
    description: "Complete 50 Pomodoro sessions",
    icon: Clock,
    color: "red",
    unlocked: false,
    progress: 12,
    total: 50,
    xp: 100,
    category: "pomodoro",
  },
  {
    id: "6",
    title: "Collaboration King",
    description: "Join 5 public workspaces",
    icon: Users,
    color: "green",
    unlocked: false,
    progress: 2,
    total: 5,
    xp: 60,
    category: "workspaces",
  },
  {
    id: "7",
    title: "Quiz Creator",
    description: "Create 10 quizzes",
    icon: FileText,
    color: "green",
    unlocked: false,
    progress: 3,
    total: 10,
    xp: 70,
    category: "quizzes",
  },
  {
    id: "8",
    title: "Study Guru",
    description: "Earn 1000 XP",
    icon: Zap,
    color: "purple",
    unlocked: false,
    progress: 750,
    total: 1000,
    xp: 150,
    category: "general",
  },
  {
    id: "9",
    title: "Perfect Week",
    description: "Study every day for a week",
    icon: Trophy,
    color: "gold",
    unlocked: true,
    date: "2023-03-12",
    xp: 100,
    category: "general",
  },
]

export function AchievementsContent() {
  const [achievements] = useState(mockAchievements)

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  const totalXP = unlockedAchievements.reduce((sum, a) => sum + a.xp, 0)
  const totalAchievements = achievements.length
  const unlockedCount = unlockedAchievements.length

  const getColorClass = (color: string) => {
    switch (color) {
      case "yellow":
        return "from-yellow-500/20 to-yellow-500/5"
      case "blue":
        return "from-blue-500/20 to-blue-500/5"
      case "green":
        return "from-green-500/20 to-green-500/5"
      case "purple":
        return "from-purple-500/20 to-purple-500/5"
      case "red":
        return "from-red-500/20 to-red-500/5"
      case "orange":
        return "from-orange-500/20 to-orange-500/5"
      case "gold":
        return "from-amber-500/20 to-amber-500/5"
      default:
        return "from-primary/20 to-primary/5"
    }
  }

  const getIconColorClass = (color: string) => {
    switch (color) {
      case "yellow":
        return "text-yellow-500"
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      case "purple":
        return "text-purple-500"
      case "red":
        return "text-red-500"
      case "orange":
        return "text-orange-500"
      case "gold":
        return "text-amber-500"
      default:
        return "text-primary"
    }
  }

  const getIconBgClass = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-500/20"
      case "blue":
        return "bg-blue-500/20"
      case "green":
        return "bg-green-500/20"
      case "purple":
        return "bg-purple-500/20"
      case "red":
        return "bg-red-500/20"
      case "orange":
        return "bg-orange-500/20"
      case "gold":
        return "bg-amber-500/20"
      default:
        return "bg-primary/20"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and unlock rewards as you use the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Achievements Unlocked
            </CardTitle>
            <CardDescription>Your progress so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {unlockedCount}/{totalAchievements}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span>{Math.round((unlockedCount / totalAchievements) * 100)}%</span>
              </div>
              <Progress value={(unlockedCount / totalAchievements) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="mr-2 h-5 w-5 text-purple-500" />
              Total XP Earned
            </CardTitle>
            <CardDescription>Experience points from achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalXP} XP</div>
            <p className="text-sm text-muted-foreground mt-2">Unlock more achievements to earn XP</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
              Next Milestone
            </CardTitle>
            <CardDescription>Your next achievement goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">Study Guru</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>750/1000 XP</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            All Achievements
          </TabsTrigger>
          <TabsTrigger value="unlocked" className="data-[state=active]:bg-background">
            Unlocked
          </TabsTrigger>
          <TabsTrigger value="locked" className="data-[state=active]:bg-background">
            In Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b ${getColorClass(achievement.color)} ${!achievement.unlocked ? "opacity-70" : ""}`}
              >
                <div className={`rounded-full ${getIconBgClass(achievement.color)} p-3 mb-3`}>
                  <achievement.icon className={`h-6 w-6 ${getIconColorClass(achievement.color)}`} />
                </div>
                <h3 className="font-medium text-center">{achievement.title}</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">{achievement.description}</p>

                {achievement.unlocked ? (
                  <Badge className="mt-2 bg-green-500 text-white">Unlocked</Badge>
                ) : (
                  <Badge variant="outline" className="mt-2">
                    {achievement.progress}/{achievement.total} Completed
                  </Badge>
                )}

                <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">
                  +{achievement.xp} XP
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b ${getColorClass(achievement.color)}`}
              >
                <div className={`rounded-full ${getIconBgClass(achievement.color)} p-3 mb-3`}>
                  <achievement.icon className={`h-6 w-6 ${getIconColorClass(achievement.color)}`} />
                </div>
                <h3 className="font-medium text-center">{achievement.title}</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">{achievement.description}</p>
                <Badge className="mt-2 bg-green-500 text-white">Unlocked</Badge>
                <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">
                  +{achievement.xp} XP
                </Badge>
              </div>
            ))}

            {unlockedAchievements.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Achievements Unlocked Yet</h3>
                <p className="text-muted-foreground">Keep using the platform to unlock achievements and earn XP.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b ${getColorClass(achievement.color)} opacity-70`}
              >
                <div className={`rounded-full ${getIconBgClass(achievement.color)} p-3 mb-3`}>
                  <achievement.icon className={`h-6 w-6 ${getIconColorClass(achievement.color)}`} />
                </div>
                <h3 className="font-medium text-center">{achievement.title}</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">{achievement.description}</p>
                <div className="w-full mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <Progress value={(achievement.progress / achievement.total) * 100} className="h-1.5" />
                </div>
                <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">
                  +{achievement.xp} XP
                </Badge>
              </div>
            ))}

            {lockedAchievements.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">All Achievements Unlocked!</h3>
                <p className="text-muted-foreground">Congratulations! You've unlocked all available achievements.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

