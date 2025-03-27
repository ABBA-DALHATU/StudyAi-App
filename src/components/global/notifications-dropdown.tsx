"use client"

import { useState } from "react"
import { Bell, BookOpen, Brain, Check, Clock, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    title: "Quiz Completed",
    message: "You scored 85% on Physics Mechanics quiz",
    time: "2 hours ago",
    read: false,
    icon: FileText,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    link: "/quizzes/2",
  },
  {
    id: "2",
    title: "New Flashcards",
    message: "Alex Taylor shared Circuit Components flashcards with you",
    time: "Yesterday",
    read: false,
    icon: Brain,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    link: "/flashcards/3",
  },
  {
    id: "3",
    title: "Document Uploaded",
    message: "New document added to Math 101 workspace",
    time: "2 days ago",
    read: false,
    icon: BookOpen,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    link: "/library",
  },
  {
    id: "4",
    title: "Study Streak",
    message: "You've maintained a 5-day study streak!",
    time: "3 days ago",
    read: true,
    icon: Zap,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    link: "/achievements",
  },
  {
    id: "5",
    title: "Pomodoro Session",
    message: "You completed 4 pomodoro sessions today",
    time: "4 days ago",
    read: true,
    icon: Clock,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    link: "/pomodoro",
  },
]

interface NotificationsDropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsDropdown({ open, onOpenChange }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="text-base">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              <Check className="mr-1 h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => markAsRead(notification.id)}
                asChild
              >
                <a href={notification.link}>
                  <div className={`${notification.iconBg} p-2 rounded-full`}>
                    <notification.icon className={`h-4 w-4 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.read && <Badge className="h-1.5 w-1.5 rounded-full bg-primary p-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </a>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

