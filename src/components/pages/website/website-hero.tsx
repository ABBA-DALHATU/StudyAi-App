"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function WebsiteHero() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-1/3 -right-64 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <Badge 
            className={`px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            AI-Powered Learning Platform
          </Badge>
          
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            Study Smarter with{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              AI-Powered Tools
            </span>
          </h1>
          
          <p 
            className={`text-xl text-muted-foreground max-w-2xl transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            StudyAI transforms how you learn with personalized quizzes, intelligent flashcards, and 
            productivity tools designed to help you achieve your academic goals faster.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 w-full max-w-md transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <Button size="lg" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90" asChild>
              <Link href="/">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              Watch Demo
            </Button>
          </div>
          
          <div 
            className={`flex flex-wrap justify-center gap-x-8 gap-y-3 pt-4 text-sm transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Free plan available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
        
        {/* Hero image */}
        <div 
          className={`mt-16 rounded-xl border bg-background/50 shadow-xl overflow-hidden transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
            <img 
              src="/placeholder.svg?height=600&width=1200" 
              alt="StudyAI Dashboard" 
              className="w-full h-auto"
            />
            
            {/* Floating UI elements for visual interest */}
            <div className="absolute top-1/4 left-1/4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-primary/20 transform -rotate-3 animate-float">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/20 p-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quiz Completed</p>
                  <p className="text-xs text-muted-foreground">Score: 95%</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/3 right-1/4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-purple-500/20 transform rotate-2 animate-float animation-delay-1000">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500/20 p-2">
                  <Flame className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">7-Day Streak</p>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Add these imports at the top
import { Flame } from 'lucide-react'
