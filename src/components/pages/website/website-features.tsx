"use client"

import { useEffect, useState, useRef } from "react"
import { Brain, FileText, Book, Clock, Zap, Users, Award, Sparkles, Lightbulb, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function WebsiteFeatures() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])
  
  const features = [
    {
      id: "quizzes",
      title: "AI-Generated Quizzes",
      description: "Create custom quizzes from your study materials",
      icon: FileText,
      color: "green",
      image: "/placeholder.svg?height=400&width=600",
      details: [
        "Upload notes or textbooks to generate personalized quizzes",
        "Multiple question formats including multiple choice, true/false, and short answer",
        "Adjustable difficulty levels to match your knowledge",
        "Detailed performance analytics to track your progress",
        "Focus on areas that need improvement with targeted quizzes"
      ]
    },
    {
      id: "flashcards",
      title: "Smart Flashcards",
      description: "Memorize concepts with spaced repetition",
      icon: Brain,
      color: "amber",
      image: "/placeholder.svg?height=400&width=600",
      details: [
        "AI-powered flashcard creation from your documents",
        "Spaced repetition algorithm optimizes your study sessions",
        "Track mastery level for each flashcard set",
        "Study on any device with cloud synchronization",
        "Organize flashcards by subject, topic, or custom tags"
      ]
    },
    {
      id: "library",
      title: "Digital Library",
      description: "Organize all your study materials in one place",
      icon: Book,
      color: "blue",
      image: "/placeholder.svg?height=400&width=600",
      details: [
        "Upload and organize documents, notes, and textbooks",
        "Powerful search functionality across all your materials",
        "Generate study aids directly from your documents",
        "Access your materials from anywhere, on any device",
        "Share resources with study groups and classmates"
      ]
    },
    {
      id: "pomodoro",
      title: "Pomodoro Timer",
      description: "Boost productivity with focused study sessions",
      icon: Clock,
      color: "red",
      image: "/placeholder.svg?height=400&width=600",
      details: [
        "Customizable Pomodoro timer to maintain focus",
        "Track study sessions and productivity metrics",
        "Earn achievements for consistent work",
        "Analyze your study patterns to optimize your schedule",
        "Integrate with your calendar to plan study sessions"
      ]
    },
    {
      id: "gamification",
      title: "Gamified Learning",
      description: "Stay motivated with achievements and streaks",
      icon: Zap,
      color: "purple",
      image: "/placeholder.svg?height=400&width=600",
      details: [
        "Earn XP for completing study activities",
        "Unlock achievements as you progress",
        "Maintain study streaks to build consistent habits",
        "Compete with friends on leaderboards",
        "Set and track personal goals with rewards"
      ]
    }
  ]
  
  const getIconColorClass = (color: string) => {
    switch (color) {
      case "green": return "text-green-500"
      case "amber": return "text-amber-500"
      case "blue": return "text-blue-500"
      case "red": return "text-red-500"
      case "purple": return "text-purple-500"
      default: return "text-primary"
    }
  }
  
  const getIconBgClass = (color: string) => {
    switch (color) {
      case "green": return "bg-green-500/10"
      case "amber": return "bg-amber-500/10"
      case "blue": return "bg-blue-500/10"
      case "red": return "bg-red-500/10"
      case "purple": return "bg-purple-500/10"
      default: return "bg-primary/10"
    }
  }
  
  return (
    <section id="features" ref={sectionRef} className="py-24">
      <div className="container">
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to Excel in Your Studies
          </h2>
          <p className="text-xl text-muted-foreground">
            StudyAI combines cutting-edge AI technology with proven study methods to help you learn more effectively.
          </p>
        </div>
        
        <Tabs defaultValue="quizzes" className="w-full">
          <div 
            className={`flex justify-center mb-12 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <TabsList className="bg-muted/50 p-2 grid grid-cols-2 md:grid-cols-5 gap-2 w-full max-w-3xl">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-background"
                >
                  <div className={`rounded-full ${getIconBgClass(feature.color)} p-2`}>
                    <feature.icon className={`h-5 w-5 ${getIconColorClass(feature.color)}`} />
                  </div>
                  <span className="text-xs font-medium">{feature.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {features.map((feature, index) => (
            <TabsContent 
              key={feature.id} 
              value={feature.id}
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={`order-2 lg:order-${index % 2 === 0 ? 2 : 1}`}>
                  <div className={`rounded-full ${getIconBgClass(feature.color)} p-3 inline-flex mb-4`}>
                    <feature.icon className={`h-6 w-6 ${getIconColorClass(feature.color)}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-xl text-muted-foreground mb-6">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`rounded-full ${getIconBgClass(feature.color)} p-1 mt-1`}>
                          <Lightbulb className={`h-3 w-3 ${getIconColorClass(feature.color)}`} />
                        </div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`order-1 lg:order-${index % 2 === 0 ? 1 : 2}`}>
                  <div className="rounded-xl overflow-hidden border shadow-lg">
                    <img 
                      src={feature.image || "/placeholder.svg"} 
                      alt={feature.title} 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-muted/30">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
            <p className="text-muted-foreground">
              Our advanced AI analyzes your study materials and learning patterns to create personalized study experiences.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-muted/30">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Collaborative</h3>
            <p className="text-muted-foreground">
              Study together with friends and classmates in shared workspaces with real-time collaboration.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-muted/30">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Data-Driven</h3>
            <p className="text-muted-foreground">
              Track your progress with detailed analytics and insights to optimize your study habits.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
