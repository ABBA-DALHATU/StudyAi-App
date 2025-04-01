"use client"

import { useEffect, useState, useRef } from "react"
import { Upload, Sparkles, BookOpen, Brain } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export function WebsiteHowItWorks() {
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
  
  const steps = [
    {
      number: 1,
      title: "Upload Your Study Materials",
      description: "Upload your notes, textbooks, or any study materials to StudyAI.",
      icon: Upload,
      delay: 0
    },
    {
      number: 2,
      title: "AI Processes Your Content",
      description: "Our AI analyzes your materials to identify key concepts and knowledge gaps.",
      icon: Sparkles,
      delay: 200
    },
    {
      number: 3,
      title: "Generate Study Resources",
      description: "Create personalized quizzes, flashcards, and study guides based on your materials.",
      icon: BookOpen,
      delay: 400
    },
    {
      number: 4,
      title: "Study and Track Progress",
      description: "Use the generated resources to study effectively and track your progress over time.",
      icon: Brain,
      delay: 600
    }
  ]
  
  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="container">
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How StudyAI Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes with our simple four-step process
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-6rem)] bg-gradient-to-b from-primary/50 to-purple-500/50 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`relative transition-all duration-700 delay-${step.delay} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${index % 2 === 0 ? 'md:text-right' : ''}`}
              >
                {/* Step number circle - positioned differently based on even/odd */}
                <div 
                  className={`absolute top-0 ${
                    index % 2 === 0 ? 'md:-right-8 md:left-auto -left-8' : 'md:-left-8 -left-8'
                  } w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold z-10`}
                >
                  {step.number}
                </div>
                
                {/* Content */}
                <div className={`pt-6 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                  <div 
                    className={`rounded-full bg-primary/10 p-3 inline-flex mb-4 ${
                      index % 2 === 0 ? 'md:ml-auto' : ''
                    }`}
                  >
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
