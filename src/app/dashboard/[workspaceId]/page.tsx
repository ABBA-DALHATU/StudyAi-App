"use client";

import { useEffect, useState } from "react";
import {
  Book,
  Brain,
  Clock,
  FileText,
  BarChart3,
  Flame,
  Plus,
  Trophy,
  Star,
  Zap,
  Award,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PomodoroTimer } from "@/components/global/PomodoroTimer";
import {
  getCurrentStreak,
  getQuizCount,
  getFlashCardCount,
  getUsersWithStreak,
  getDigitalResouceCount,
} from "@/actions";
import { useParams } from "next/navigation";

type leaderBoardType = {
  name: string;
  score: number;
};
export default function DashboardPage() {
  const [xp, setXp] = useState(750);
  const [level, setLevel] = useState(5);
  const xpForNextLevel = 1000;
  const xpProgress = (xp / xpForNextLevel) * 100;

  const [streakScore, setStreakScore] = useState<number>(0);
  const [leaderBoard, setLeaderBoard] = useState<leaderBoardType[]>([]);

  const [numOfdocx, setNumOfDocx] = useState<number | null>(null);
  const [numOfQuiz, setNumOfQuiz] = useState<number | null>(null);
  const [numOfFlash, setNumOfFlash] = useState<number | null>(null);

  const { workspaceId } = useParams();
  useEffect(() => {
    const fetchStreak = async () => {
      const res = await getCurrentStreak();
      const streak = res?.daysCount;

      const leaderBoardRes = await getUsersWithStreak(workspaceId as string);

      const [docxCount, quizCount, flashCardCount] = await Promise.all([
        getDigitalResouceCount(workspaceId as string),
        getQuizCount(workspaceId as string),
        getFlashCardCount(workspaceId as string),
      ]);

      setNumOfDocx(docxCount);
      setNumOfQuiz(quizCount);
      setNumOfFlash(flashCardCount);

      setLeaderBoard(leaderBoardRes);
      setStreakScore(streak || 0);
    };

    fetchStreak();
  }, [workspaceId]);

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your study dashboard. Track your progress and access
              your study materials.
            </p>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{level}</span>
                </div>
                <svg className="h-12 w-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-muted/20"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${xpProgress * 1.256} 126`}
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Level {level} Scholar</p>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {xp} XP
                </Badge>
              </div>
              <div className="w-full mt-1">
                <Progress value={xpProgress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {xpForNextLevel - xp} XP until Level {level + 1}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="pomodoro"
              className="data-[state=active]:bg-background"
            >
              Pomodoro
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-background"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-background"
            >
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Digital Resources
                  </CardTitle>
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <Book className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{numOfdocx || "..."}</div>
                  <p className="text-xs text-muted-foreground">
                    Documents in your library
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group"
                    asChild
                  >
                    <a href="/library">
                      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                      Add Document
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
                  <div className="rounded-full bg-green-500/10 p-2">
                    <FileText className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{numOfQuiz || "..."}</div>
                  <p className="text-xs text-muted-foreground">
                    Quizzes created
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group"
                    asChild
                  >
                    <a href="/quizzes">
                      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                      Create Quiz
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Flashcards
                  </CardTitle>
                  <div className="rounded-full bg-amber-500/10 p-2">
                    <Brain className="h-4 w-4 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {numOfFlash || "..."}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Flashcard sets
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group"
                    asChild
                  >
                    <a href="/flashcards">
                      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                      Create Flashcards
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Streak
                  </CardTitle>
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{streakScore} days</div>
                  <p className="text-xs text-muted-foreground">
                    Keep it going!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full group">
                    <BarChart3 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    View Stats
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent study activities across all workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            Completed Physics Quiz
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500 border-green-500/20"
                          >
                            +50 XP
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Score: 85%
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2 hours ago
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-500/10 p-2">
                        <Book className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            Uploaded Math Notes
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                          >
                            +20 XP
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Math 101 workspace
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Yesterday
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-amber-500/10 p-2">
                        <Brain className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            Created Biology Flashcards
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                          >
                            +35 XP
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          25 cards
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2 days ago
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-500/10 p-2">
                        <Clock className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            Completed Pomodoro Session
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-500 border-red-500/20"
                          >
                            +15 XP
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          4 sessions
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        3 days ago
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>
                    Top performers in your workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                        1
                      </div>
                      <Avatar className="h-8 w-8 ring-2 ring-yellow-400">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="User"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Jane Doe</p>
                      </div>
                      <div className="font-medium flex items-center">
                        <Trophy className="h-3 w-3 text-yellow-500 mr-1" />
                        850 pts
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-white">
                        2
                      </div>
                      <Avatar className="h-8 w-8 ring-2 ring-gray-300">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="User"
                        />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">John Smith</p>
                      </div>
                      <div className="font-medium flex items-center">
                        <Trophy className="h-3 w-3 text-gray-400 mr-1" />
                        720 pts
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                        3
                      </div>
                      <Avatar className="h-8 w-8 ring-2 ring-amber-600">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="User"
                        />
                        <AvatarFallback>AT</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Alex Taylor</p>
                      </div>
                      <div className="font-medium flex items-center">
                        <Trophy className="h-3 w-3 text-amber-600 mr-1" />
                        680 pts
                      </div>
                    </div> */}

                    {leaderBoard.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            index + 1 === 1
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                              : index + 1 === 2
                              ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                              : index + 1 === 3
                              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
                              : "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                        </div>
                        <div className="font-medium flex items-center">
                          <Trophy
                            className={`h-3 w-3 mr-1 ${
                              index + 1 === 1
                                ? "text-yellow-500"
                                : index + 1 === 2
                                ? "text-gray-400"
                                : index + 1 === 3
                                ? "text-amber-600"
                                : "text-zinc-500"
                            }`}
                          />
                          {item.score} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Pomodoro Timer</CardTitle>
                <CardDescription>
                  Focus on your studies with timed sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PomodoroTimer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Track your progress and unlock rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-yellow-500/10 to-transparent">
                    <div className="rounded-full bg-yellow-500/20 p-3 mb-3">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <h3 className="font-medium text-center">First Quiz Ace</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Score 100% on any quiz
                    </p>
                    <Badge className="mt-2 bg-yellow-500 text-white">
                      Unlocked
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-blue-500/10 to-transparent">
                    <div className="rounded-full bg-blue-500/20 p-3 mb-3">
                      <Book className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="font-medium text-center">Library Builder</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Add 10 documents to your library
                    </p>
                    <Badge className="mt-2 bg-blue-500 text-white">
                      Unlocked
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-purple-500/10 to-transparent">
                    <div className="rounded-full bg-purple-500/20 p-3 mb-3">
                      <Award className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-medium text-center">Streak Master</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Maintain a 7-day study streak
                    </p>
                    <Badge className="mt-2 bg-purple-500 text-white">
                      Unlocked
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-gray-500/10 to-transparent">
                    <div className="rounded-full bg-gray-500/20 p-3 mb-3">
                      <Brain className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-center">Memory Master</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Create 20 flashcard sets
                    </p>
                    <Badge variant="outline" className="mt-2">
                      3/20 Completed
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-gray-500/10 to-transparent">
                    <div className="rounded-full bg-gray-500/20 p-3 mb-3">
                      <Clock className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-center">Focus Champion</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Complete 50 Pomodoro sessions
                    </p>
                    <Badge variant="outline" className="mt-2">
                      12/50 Completed
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-gray-500/10 to-transparent">
                    <div className="rounded-full bg-gray-500/20 p-3 mb-3">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-center">
                      Collaboration King
                    </h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Join 5 public workspaces
                    </p>
                    <Badge variant="outline" className="mt-2">
                      2/5 Completed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Study Statistics</CardTitle>
                <CardDescription>
                  Track your study progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Study statistics visualization would appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
