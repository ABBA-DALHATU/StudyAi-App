"use client"

import { Book, Upload, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LibraryHeaderProps {
  onUpload: () => void
}

export function LibraryHeader({ onUpload }: LibraryHeaderProps) {
  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 border-b">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
              <Book className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Digital Library</h1>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              <Zap className="h-3 w-3 mr-1" />
              +5 XP per upload
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Store and manage your study materials in one place</p>
        </div>

        <Button onClick={onUpload} className="bg-blue-500 hover:bg-blue-600 transition-colors">
          <Upload className="mr-2 h-4 w-4" />
          Upload Resource
        </Button>
      </div>
    </div>
  )
}

