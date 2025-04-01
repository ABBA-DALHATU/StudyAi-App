"use client"

import { useEffect, useState, useRef } from "react"
import { Users, BookOpen, Award, Clock } from 'lucide-react'

export function WebsiteStats() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({
    students: 0,
    resources: 0,
    achievements: 0,
    hours: 0
  })
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const targetCounts = {
    students: 50000,
    resources: 250000,
    achievements: 1000000,
    hours: 500000
  }
  
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
  
  useEffect(() => {
    if (!isVisible) return
    
    const duration = 2000 // ms
    const interval = 20 // ms
    const steps = duration / interval
    
    const incrementValues = {
      students: targetCounts.students / steps,
      resources: targetCounts.resources / steps,
      achievements: targetCounts.achievements / steps,
      hours: targetCounts.hours / steps
    }
    
    let currentStep = 0
    
    const timer = setInterval(() => {
      currentStep++
      
      setCounts({
        students: Math.min(Math.round(incrementValues.students * currentStep), targetCounts.students),
        resources: Math.min(Math.round(incrementValues.resources * currentStep), targetCounts.resources),
        achievements: Math.min(Math.round(incrementValues.achievements * currentStep), targetCounts.achievements),
        hours: Math.min(Math.round(incrementValues.hours * currentStep), targetCounts.hours)
      })
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [isVisible])
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+'
    }
    return num.toString() + '+'
  }
  
  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-500/10 p-4 mb-4">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(counts.students)}</div>
            <p className="text-muted-foreground">Active Students</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-500/10 p-4 mb-4">
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(counts.resources)}</div>
            <p className="text-muted-foreground">Study Resources</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-amber-500/10 p-4 mb-4">
              <Award className="h-8 w-8 text-amber-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(counts.achievements)}</div>
            <p className="text-muted-foreground">Achievements Earned</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-red-500/10 p-4 mb-4">
              <Clock className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(counts.hours)}</div>
            <p className="text-muted-foreground">Study Hours Logged</p>
          </div>
        </div>
      </div>
    </section>
  )
}
