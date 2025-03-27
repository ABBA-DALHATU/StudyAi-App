"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FlashcardPreviewProps {
  card: {
    id: string
    front: string
    back: string
  }
}

export function FlashcardPreview({ card }: FlashcardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative group">
      <Card
        className={`h-[200px] cursor-pointer transition-all duration-500 perspective-1000 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute inset-0 backface-hidden">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <p className="font-medium">{card.front}</p>
            </div>
            <div className="text-xs text-muted-foreground text-center">Click to flip</div>
          </CardContent>
        </div>

        <div className="absolute inset-0 rotate-y-180 backface-hidden">
          <CardContent className="p-4 h-full flex flex-col bg-amber-500/5 border-amber-500/20">
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <p>{card.back}</p>
            </div>
            <div className="text-xs text-muted-foreground text-center">Click to flip back</div>
          </CardContent>
        </div>
      </Card>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm">
          <Edit className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  )
}

