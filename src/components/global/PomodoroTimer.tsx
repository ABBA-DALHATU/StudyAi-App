"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createSession, getPreferences, updatePreferences } from "@/actions";
import { Badge } from "../ui/badge";

interface PomodoroTimerProps {
  onSessionComplete: () => void;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  // State for settings with default values
  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  });

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break" | "longBreak">("focus");
  const [secondsLeft, setSecondsLeft] = useState(settings.focusDuration * 60);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load preferences on component mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const preferences = await getPreferences();
        if (preferences) {
          setSettings(preferences);
          setSecondsLeft(preferences.focusDuration * 60);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }
    loadPreferences();
  }, []);

  // Calculate total duration based on current mode
  const getTotalSeconds = useCallback(() => {
    if (mode === "focus") return settings.focusDuration * 60;
    if (mode === "break") return settings.shortBreakDuration * 60;
    return settings.longBreakDuration * 60;
  }, [mode, settings]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const calculateProgress = useCallback(() => {
    const total = getTotalSeconds();
    return ((total - secondsLeft) / total) * 100;
  }, [getTotalSeconds, secondsLeft]);

  // Handle timer completion
  const handleTimerComplete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);

    try {
      if (mode === "focus") {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);

        // Save the completed session to the database
        await createSession({
          duration: settings.focusDuration,
          type: "FOCUS",
        });

        // Notify parent component
        onSessionComplete();

        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
          setMode("longBreak");
          setSecondsLeft(settings.longBreakDuration * 60);
        } else {
          setMode("break");
          setSecondsLeft(settings.shortBreakDuration * 60);
        }

        // Start the new timer automatically
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setMode("focus");
        setSecondsLeft(settings.focusDuration * 60);

        // Start the new focus timer automatically
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } finally {
      setIsCompleting(false);
    }

    // Play sound notification
    const audio = new Audio("/notification.wav");
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  // Start/pause timer
  const toggleTimer = () => {
    if (isCompleting) return;

    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Reset timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(settings.focusDuration * 60);
    setProgress(0);
  };

  // Apply settings
  const applySettings = async () => {
    try {
      await updatePreferences(settings);
      resetTimer();
      setSecondsLeft(settings.focusDuration * 60);
      setSettingsOpen(false);
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  // Update progress
  useEffect(() => {
    setProgress(calculateProgress());
  }, [secondsLeft, calculateProgress]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Update timer when settings change
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(getTotalSeconds());
      setProgress(0);
    }
  }, [getTotalSeconds, isRunning, settings]);

  // Get color based on mode
  const getModeColor = () => {
    if (mode === "focus") return "text-red-500";
    if (mode === "break") return "text-green-500";
    return "text-blue-500";
  };

  const getModeGradient = () => {
    if (mode === "focus") return "from-red-500 to-red-500";
    if (mode === "break") return "from-green-500 to-green-500";
    return "from-blue-500 to-blue-500";
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${getModeColor()}`}>
          {mode === "focus"
            ? "Focus Time"
            : mode === "break"
            ? "Short Break"
            : "Long Break"}
        </h2>
        <p className="text-muted-foreground">
          {mode === "focus"
            ? "Stay focused on your task"
            : "Take a break and relax"}
        </p>
      </div>

      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-muted/30"></div>
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${getModeGradient()} opacity-20`}
          style={{
            clipPath: `circle(${progress}% at center)`,
          }}
        ></div>
        <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
          <span className={`text-5xl font-bold ${getModeColor()}`}>
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={toggleTimer}
          size="lg"
          className={`transition-all ${
            mode === "focus"
              ? "bg-red-500 hover:bg-red-600"
              : mode === "break"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isRunning ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" size="icon" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Reset</span>
        </Button>
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
              <DialogDescription>
                Customize your Pomodoro timer settings
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="focus-time">Focus Time</Label>
                <Select
                  value={settings.focusDuration.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      focusDuration: Number(value),
                    }))
                  }
                >
                  <SelectTrigger id="focus-time">
                    <SelectValue placeholder="25 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((min) => (
                      <SelectItem key={min} value={min.toString()}>
                        {min} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="break-time">Short Break</Label>
                <Select
                  value={settings.shortBreakDuration.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      shortBreakDuration: Number(value),
                    }))
                  }
                >
                  <SelectTrigger id="break-time">
                    <SelectValue placeholder="5 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 10, 15].map((min) => (
                      <SelectItem key={min} value={min.toString()}>
                        {min} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="long-break-time">Long Break</Label>
                <Select
                  value={settings.longBreakDuration.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      longBreakDuration: Number(value),
                    }))
                  }
                >
                  <SelectTrigger id="long-break-time">
                    <SelectValue placeholder="15 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 15, 20, 25, 30].map((min) => (
                      <SelectItem key={min} value={min.toString()}>
                        {min} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="sessions">Sessions before long break</Label>
                <Select
                  value={settings.sessionsBeforeLongBreak.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      sessionsBeforeLongBreak: Number(value),
                    }))
                  }
                >
                  <SelectTrigger id="sessions">
                    <SelectValue placeholder="4 sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((sessions) => (
                      <SelectItem key={sessions} value={sessions.toString()}>
                        {sessions} sessions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applySettings}>Apply Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-muted-foreground">
            Completed sessions: {completedSessions}
          </p>
          {completedSessions > 0 && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              +{completedSessions * 15} XP
            </Badge>
          )}
        </div>
        <div className="mt-2 flex gap-1.5 justify-center">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map(
            (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < completedSessions % settings.sessionsBeforeLongBreak ||
                  (i === 0 &&
                    completedSessions % settings.sessionsBeforeLongBreak ===
                      0 &&
                    completedSessions > 0)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
