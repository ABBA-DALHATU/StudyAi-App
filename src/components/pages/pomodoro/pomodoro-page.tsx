"use client";

import { useState, useEffect } from "react";
import { Clock, BarChart3, History, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PomodoroTimer } from "@/components/global/PomodoroTimer";
import { getStats } from "@/actions";

export function PomodoroPage() {
  const [stats, setStats] = useState({
    todaysSessions: 0,
    todaysXp: 0,
    totalSessions: 0,
    totalFocusHours: 0,
    currentStreak: 0,
  });

  // Load stats on component mount
  useEffect(() => {
    async function loadStats() {
      try {
        const statsData = await getStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    }
    loadStats();
  }, []);

  // This would be called from the PomodoroTimer component when a session is completed
  const handleSessionComplete = async () => {
    try {
      const updatedStats = await getStats();
      setStats(updatedStats);
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted-foreground">
          Use the Pomodoro Technique to boost your productivity and focus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-red-500" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Sessions completed today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.todaysSessions}</div>
            <p className="text-sm text-muted-foreground">
              {stats.todaysSessions > 0
                ? `+${stats.todaysXp} XP earned today`
                : "Complete sessions to earn XP"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <History className="mr-2 h-5 w-5 text-amber-500" />
              Total Sessions
            </CardTitle>
            <CardDescription>All-time completed sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
            <p className="text-sm text-muted-foreground">
              {stats.totalSessions > 0
                ? `${stats.totalFocusHours.toFixed(1)} hours of focused work`
                : "Start your first session"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
              Current Streak
            </CardTitle>
            <CardDescription>Consecutive days with sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.currentStreak}</div>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: Math.min(stats.currentStreak, 7) }).map(
                (_, i) => (
                  <Badge
                    key={i}
                    className="bg-primary h-2 w-2 p-0 rounded-full"
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timer" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="timer"
            className="data-[state=active]:bg-background"
          >
            Timer
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-background"
          >
            Statistics
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-background"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Focus Timer</CardTitle>
              <CardDescription>
                Stay focused on your tasks with timed sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PomodoroTimer onSessionComplete={handleSessionComplete} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Statistics</CardTitle>
              <CardDescription>
                Track your focus sessions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mb-2" />
                  <p className="text-sm">
                    Productivity statistics visualization would appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>
                Customize your Pomodoro timer settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Settings className="h-8 w-8 mb-2" />
                  <p className="text-sm">Timer settings would appear here</p>
                  <p className="text-xs mt-2">
                    You can already adjust these in the timer dialog
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
