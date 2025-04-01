"use client"

import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Medical Student",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    content: "StudyAI has completely transformed how I prepare for exams. The AI-generated flashcards saved me countless hours of preparation time, and the spaced repetition system helped me retain complex medical terminology much more effectively.",
    rating: 5,
  },
  {
    name: "Samantha Lee",
    role: "Computer Science Major",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SL",
    content: "As a CS student, I have tons of concepts to memorize. The quiz feature helps me identify gaps in my knowledge, and the pomodoro timer keeps me focused during long study sessions. My grades have improved significantly since I started using StudyAI.",
    rating: 5,
  },
  {
    name: "Marcus Taylor",
    role: "High School Teacher",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MT",
    content: "I recommend StudyAI to all my students. The collaborative workspaces allow them to study together effectively, and I can see their progress in real-time. It's an invaluable tool for both educators and students.",
    rating: 4,
  },
  {
    name: "Priya Patel",
    role: "Law Student",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "PP",
    content: "Preparing for the bar exam was daunting until I found StudyAI. The ability to upload my notes and generate quizzes automatically was a game-changer. The achievement system kept me motivated through months of intense studying.",
    rating: 5,
  },
  {
    name: "David Wilson",
    role: "MBA Candidate",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DW",
    content: "The digital library feature is perfect for organizing all my business case studies and notes. I can access everything from any device, and the search functionality makes finding specific information incredibly easy.",
    rating: 4,
  },
  {
    name: "Emma Rodriguez",
    role: "Language Learner",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ER",
    content: "I'm using StudyAI to learn Japanese, and it's been fantastic. The flashcard system is perfect for vocabulary, and the gamification elements keep me coming back day after day. My streak is at 87 days and counting!",
    rating: 5,
  },
]

export function WebsiteTestimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)
  
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
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }
  
  // Auto-advance testimonials
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isVisible, activeIndex])
  
  return (
    <section id="testimonials" ref={sectionRef} className="py-24">
      <div className="container">
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by Students and Educators
          </h2>
          <p className="text-xl text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say about StudyAI.
          </p>
        </div>
        
        <div 
          className={`relative max-w-4xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div 
            ref={testimonialRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="shadow-lg border-primary/10">
                    <CardContent className="pt-10 pb-6 relative">
                      <div className="absolute top-6 left-6 text-primary/20">
                        <Quote className="h-12 w-12" />
                      </div>
                      <div className="flex items-center gap-1 mb-6 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={i < testimonial.rating ? "currentColor" : "none"}
                            stroke={i < testimonial.rating ? "none" : "currentColor"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-500" : "text-muted-foreground"}`}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-lg text-center mb-6">"{testimonial.content}"</p>
                    </CardContent>
                    <CardFooter className="border-t pt-6 pb-8 flex flex-col items-center gap-3">
                      <Avatar className="h-16 w-16 border-4 border-background">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full bg-background shadow-md z-10"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full bg-background shadow-md z-10"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-primary scale-125' : 'bg-muted'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
